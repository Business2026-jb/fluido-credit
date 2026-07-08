import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/mail";
import { sendPushToUser } from "@/lib/push";

const APP_URL = "https://fluidocredit.com";

const VALID_STATUSES = ["PENDING", "COMPLETED", "REJECTED", "CANCELLED"] as const;

type DepositStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string): status is DepositStatus {
  return VALID_STATUSES.includes(status as DepositStatus);
}

function formatMoney(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function methodLabel(method: string) {
  if (method === "USDT_TRC20") return "USDT Deposit - TRX Tron TRC20";
  if (method === "BANK_TRANSFER") return "Bank Transfer Deposit";
  return method;
}

function transactionStatus(status: DepositStatus) {
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "REJECTED") return "FAILED";
  if (status === "CANCELLED") return "CANCELLED";
  return "PENDING";
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const depositId = String(formData.get("depositId") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const adminNote = String(formData.get("adminNote") || "").trim();

    if (!depositId || !status) {
      return NextResponse.json(
        { message: "Deposit ID and status are required." },
        { status: 400 }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        { message: "Invalid deposit status." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingDeposit = await tx.depositRequest.findUnique({
        where: { id: depositId },
        include: {
          user: true,
          account: true,
        },
      });

      if (!existingDeposit) {
        throw new Error("Deposit request not found.");
      }

      let account = existingDeposit.account;

      if (!account) {
        account = await tx.account.findFirst({
          where: {
            userId: existingDeposit.userId,
            type: "MAIN",
            isActive: true,
          },
        });
      }

      if (!account) {
        throw new Error("Customer main account not found.");
      }

      const alreadyCompleted = existingDeposit.status === "COMPLETED";
      const shouldCredit = status === "COMPLETED" && !alreadyCompleted;

      if (shouldCredit) {
        await tx.account.update({
          where: { id: account.id },
          data: {
            balance: { increment: existingDeposit.amount },
            availableBalance: { increment: existingDeposit.amount },
          },
        });
      }

      const deposit = await tx.depositRequest.update({
        where: { id: existingDeposit.id },
        data: {
          status,
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          accountId: account.id,
        },
        include: {
          user: true,
          account: true,
        },
      });

      const existingTransaction = await tx.transaction.findFirst({
        where: {
          reference: deposit.reference,
        },
      });

      if (existingTransaction) {
        await tx.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: transactionStatus(status),
            description:
              status === "COMPLETED"
                ? "Deposit approved and credited to the customer Fluido Credit account."
                : status === "REJECTED"
                ? adminNote ||
                  "Deposit rejected because the payment was not received or could not be confirmed."
                : status === "CANCELLED"
                ? adminNote || "Deposit request cancelled."
                : adminNote ||
                  "Deposit request requires additional information or is still under review.",
          },
        });
      } else {
        await tx.transaction.create({
          data: {
            userId: deposit.userId,
            accountId: account.id,
            type: "DEPOSIT",
            direction: "IN",
            amount: deposit.amount,
            currency: deposit.currency || "EUR",
            title: `Deposit - ${methodLabel(deposit.method)}`,
            description:
              status === "COMPLETED"
                ? "Deposit approved and credited to the customer Fluido Credit account."
                : "Deposit request updated by admin.",
            reference: deposit.reference,
            status: transactionStatus(status),
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: deposit.userId,
          type: "SYSTEM",
          title:
            status === "COMPLETED"
              ? "Deposit approved"
              : status === "REJECTED"
              ? "Deposit could not be confirmed"
              : status === "CANCELLED"
              ? "Deposit cancelled"
              : "Additional information required",
          message:
            status === "COMPLETED"
              ? `Your deposit of ${formatMoney(
                  deposit.amount,
                  deposit.currency
                )} has been approved and credited to your Fluido Credit account.`
              : status === "REJECTED"
              ? `Your deposit of ${formatMoney(
                  deposit.amount,
                  deposit.currency
                )} could not be confirmed because the payment was not received or could not be matched.`
              : status === "CANCELLED"
              ? `Your deposit request of ${formatMoney(
                  deposit.amount,
                  deposit.currency
                )} has been cancelled.`
              : `Additional information is required to validate your deposit of ${formatMoney(
                  deposit.amount,
                  deposit.currency
                )}.`,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action:
            status === "COMPLETED"
              ? "DEPOSIT_APPROVED"
              : status === "REJECTED"
              ? "DEPOSIT_REJECTED"
              : status === "CANCELLED"
              ? "DEPOSIT_CANCELLED"
              : "DEPOSIT_MORE_INFORMATION_REQUESTED",
          entity: "DepositRequest",
          entityId: deposit.id,
        },
      });

      return {
        deposit,
        credited: shouldCredit,
      };
    });

    const { deposit, credited } = result;

    try {
      const amount = formatMoney(deposit.amount, deposit.currency || "EUR");
      const method = methodLabel(deposit.method);

      const emailContent =
        status === "COMPLETED"
          ? {
              subject: "Your Fluido Credit deposit has been approved",
              title: "Deposit approved",
              message: `We have received and confirmed your payment. Your Fluido Credit account has been credited with ${amount}.`,
              boxColor: "#eefdf5",
              titleColor: "#047857",
            }
          : status === "REJECTED"
          ? {
              subject: "Fluido Credit - Deposit could not be confirmed",
              title: "Deposit could not be confirmed",
              message:
                "Our finance team could not confirm this deposit because the corresponding payment was not received or could not be matched with your proof of payment.",
              boxColor: "#fff1f2",
              titleColor: "#dc2626",
            }
          : status === "CANCELLED"
          ? {
              subject: "Your Fluido Credit deposit has been cancelled",
              title: "Deposit cancelled",
              message:
                "Your deposit request has been cancelled. No funds have been credited to your Fluido Credit account.",
              boxColor: "#f8fafc",
              titleColor: "#334155",
            }
          : {
              subject: "Additional information required for your deposit",
              title: "Additional information required",
              message:
                "Before we can validate your deposit, our finance team needs additional information or a clearer payment proof.",
              boxColor: "#fffbeb",
              titleColor: "#d97706",
            };

      await sendEmail({
        to: deposit.user.email,
        subject: emailContent.subject,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
              <h2 style="color:${emailContent.titleColor};margin-top:24px;">${emailContent.title}</h2>

              <p>Hello <strong>${deposit.user.fullName}</strong>,</p>
              <p>${emailContent.message}</p>

              ${
                adminNote
                  ? `<div style="background:#eef5ff;border-radius:18px;padding:18px;margin:24px 0;">
                      <strong>Admin note:</strong>
                      <p style="margin-bottom:0;">${adminNote}</p>
                    </div>`
                  : ""
              }

              <div style="background:${emailContent.boxColor};border-radius:18px;padding:22px;margin:24px 0;">
                <p><strong>Amount:</strong> ${amount}</p>
                <p><strong>Method:</strong> ${method}</p>
                <p><strong>Reference:</strong> ${deposit.reference}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Credited:</strong> ${
                  credited ? "Yes, funds credited to your Fluido balance." : "No"
                }</p>
              </div>

              ${
                status === "REJECTED"
                  ? `<p style="font-size:14px;color:#64748b;">
                      If you believe this is an error, please contact Fluido Credit Support with your payment receipt and deposit reference.
                    </p>`
                  : `<p style="font-size:14px;color:#64748b;">
                      You can view this update from your secure Fluido Credit dashboard.
                    </p>`
              }
            </div>
          </div>
        `,
      });
    } catch (emailError) {
  console.error("DEPOSIT_STATUS_EMAIL_ERROR:", emailError);
}

await sendPushToUser({
  userId: deposit.userId,
  title:
    status === "COMPLETED"
      ? "Deposit approved"
      : status === "REJECTED"
      ? "Deposit not confirmed"
      : status === "CANCELLED"
      ? "Deposit cancelled"
      : "Deposit update",
  message:
    status === "COMPLETED"
      ? "Your deposit has been approved and credited."
      : status === "REJECTED"
      ? "Your deposit could not be confirmed."
      : status === "CANCELLED"
      ? "Your deposit request has been cancelled."
      : "Additional information is required for your deposit.",
  url: "/notifications",
});

return NextResponse.redirect(`${APP_URL}/admin/deposits`);
  } catch (error) {
    console.error("ADMIN_DEPOSIT_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update deposit status." },
      { status: 500 }
    );
  }
}