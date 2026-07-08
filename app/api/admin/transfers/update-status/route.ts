import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/mail";
import { sendPushToUser } from "@/lib/push";

const APP_URL = "https://fluidocredit.com";

const VALID_STATUSES = ["PROCESSING", "COMPLETED", "FAILED", "CANCELLED"] as const;

type TransferStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string): status is TransferStatus {
  return VALID_STATUSES.includes(status as TransferStatus);
}

function formatMoney(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function getStatusContent(status: TransferStatus, amount: number, currency: string) {
  const formattedAmount = formatMoney(amount, currency);

  if (status === "PROCESSING") {
    return {
      subject: "Your Fluido Credit transfer is processing",
      title: "Transfer processing",
      message: `Your transfer of ${formattedAmount} is now being processed securely.`,
    };
  }

  if (status === "COMPLETED") {
    return {
      subject: "Your Fluido Credit transfer has been completed",
      title: "Transfer completed",
      message: `Your transfer of ${formattedAmount} has been completed successfully.`,
    };
  }

  if (status === "FAILED") {
    return {
      subject: "Your Fluido Credit transfer could not be completed",
      title: "Transfer failed",
      message: `Your transfer of ${formattedAmount} could not be completed. Please contact support if you need assistance.`,
    };
  }

  return {
    subject: "Your Fluido Credit transfer has been cancelled",
    title: "Transfer cancelled",
    message: `Your transfer of ${formattedAmount} has been cancelled.`,
  };
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const transactionId = String(formData.get("transactionId") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const note = String(formData.get("note") || "").trim();

    if (!transactionId || !status) {
      return NextResponse.json(
        { message: "Transaction ID and status are required." },
        { status: 400 }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        { message: "Invalid transfer status." },
        { status: 400 }
      );
    }

    const transfer = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        description: note || undefined,
      },
      include: {
        user: true,
        account: true,
      },
    });

    const content = getStatusContent(
      status,
      transfer.amount,
      transfer.currency || "EUR"
    );

    await prisma.notification.create({
      data: {
        userId: transfer.userId,
        type: "SYSTEM",
        title: content.title,
        message: content.message,
      },
    });

    try {
      await sendEmail({
        to: transfer.user.email,
        subject: content.subject,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
              <h2 style="color:#06183A;margin-top:24px;">${content.title}</h2>

              <p>Hello <strong>${transfer.user.fullName}</strong>,</p>
              <p>${content.message}</p>

              ${
                note
                  ? `<div style="background:#eef5ff;border-radius:18px;padding:18px;margin:24px 0;">
                      <strong>Admin note:</strong>
                      <p style="margin-bottom:0;">${note}</p>
                    </div>`
                  : ""
              }

              <div style="background:#f8fafc;border-radius:18px;padding:18px;margin:24px 0;">
                <p><strong>Amount:</strong> ${formatMoney(
                  transfer.amount,
                  transfer.currency || "EUR"
                )}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Reference:</strong> ${transfer.reference || transfer.id}</p>
                <p><strong>Beneficiary:</strong> ${
                  transfer.beneficiaryName || "Not provided"
                }</p>
              </div>

              <p style="font-size:13px;color:#64748b;">
                You can view this update from your secure Fluido Credit dashboard.
              </p>
            </div>
          </div>
        `,
      });

      if (
        status === "COMPLETED" &&
        transfer.direction === "OUT" &&
        transfer.beneficiaryIban
      ) {
        const receiverAccount = await prisma.account.findFirst({
          where: {
            iban: transfer.beneficiaryIban,
            isActive: true,
          },
          include: {
            user: true,
          },
        });

        if (receiverAccount?.user?.email) {
          await prisma.notification.create({
            data: {
              userId: receiverAccount.userId,
              type: "SYSTEM",
              title: "Incoming transfer completed",
              message: `You received ${formatMoney(
                transfer.amount,
                transfer.currency || "EUR"
              )} from ${transfer.user.fullName}.`,
            },
          });

          await sendEmail({
            to: receiverAccount.user.email,
            subject: "You received a Fluido Credit transfer",
            html: `
              <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
                <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
                  <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
                  <h2 style="color:#06183A;margin-top:24px;">Incoming transfer completed</h2>

                  <p>Hello <strong>${receiverAccount.user.fullName}</strong>,</p>
                  <p>You have received a transfer from <strong>${transfer.user.fullName}</strong>.</p>

                  <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
                    <p><strong>Amount:</strong> ${formatMoney(
                      transfer.amount,
                      transfer.currency || "EUR"
                    )}</p>
                    <p><strong>Status:</strong> Completed</p>
                    <p><strong>Reference:</strong> ${transfer.reference || transfer.id}</p>
                  </div>

                  <p style="font-size:13px;color:#64748b;">
                    This transfer is now visible in your secure Fluido Credit account.
                  </p>
                </div>
              </div>
            `,
          });
        }
      }
    } catch (emailError) {
  console.error("ADMIN_TRANSFER_EMAIL_ERROR:", emailError);
}

await sendPushToUser({
  userId: transfer.userId,
  title: "Transfer update",
  message: `Your transfer is now ${status}.`,
  url: "/transactions",
});

return NextResponse.redirect(`${APP_URL}/admin/transfers`);
  } catch (error) {
    console.error("ADMIN_TRANSFER_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update transfer status." },
      { status: 500 }
    );
  }
}