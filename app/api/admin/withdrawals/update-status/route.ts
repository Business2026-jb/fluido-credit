import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/mail";

const APP_URL = "https://fluidocredit.com";

const VALID_STATUSES = ["PROCESSING", "COMPLETED", "FAILED", "CANCELLED"] as const;

type WithdrawalStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string): status is WithdrawalStatus {
  return VALID_STATUSES.includes(status as WithdrawalStatus);
}

function formatMoney(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function getStatusContent(
  status: WithdrawalStatus,
  amount: number,
  currency: string,
  refunded: boolean
) {
  const formattedAmount = formatMoney(amount, currency);

  if (status === "PROCESSING") {
    return {
      subject: "Your Fluido Credit withdrawal is processing",
      title: "Withdrawal processing",
      message: `Your withdrawal request of ${formattedAmount} is now being processed securely.`,
    };
  }

  if (status === "COMPLETED") {
    return {
      subject: "Your Fluido Credit withdrawal has been completed",
      title: "Withdrawal completed",
      message: `Your withdrawal request of ${formattedAmount} has been completed successfully.`,
    };
  }

  if (status === "FAILED") {
    return {
      subject: "Your Fluido Credit withdrawal could not be completed",
      title: "Withdrawal failed",
      message: refunded
        ? `Your withdrawal request of ${formattedAmount} could not be completed. The funds have been returned to your Fluido Credit account.`
        : `Your withdrawal request of ${formattedAmount} could not be completed.`,
    };
  }

  return {
    subject: "Your Fluido Credit withdrawal has been cancelled",
    title: "Withdrawal cancelled",
    message: refunded
      ? `Your withdrawal request of ${formattedAmount} has been cancelled. The funds have been returned to your Fluido Credit account.`
      : `Your withdrawal request of ${formattedAmount} has been cancelled.`,
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
        { message: "Invalid withdrawal status." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingWithdrawal = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          account: true,
        },
      });

      if (!existingWithdrawal) {
        throw new Error("Withdrawal transaction not found.");
      }

      if (existingWithdrawal.type !== "WITHDRAWAL") {
        throw new Error("This transaction is not a withdrawal.");
      }

      let refunded = false;

      const mustRefund =
        (status === "FAILED" || status === "CANCELLED") &&
        existingWithdrawal.status !== "FAILED" &&
        existingWithdrawal.status !== "CANCELLED";

      if (mustRefund) {
  if (!existingWithdrawal.accountId || !existingWithdrawal.account) {
    throw new Error("Withdrawal account not found.");
  }

  const refundReference = `WITHDRAWAL-REFUND-${existingWithdrawal.id}`;

  const existingRefund = await tx.transaction.findFirst({
    where: { reference: refundReference },
  });

  if (!existingRefund) {
    await tx.account.update({
      where: { id: existingWithdrawal.accountId },
      data: {
        balance: { increment: existingWithdrawal.amount },
        availableBalance: { increment: existingWithdrawal.amount },
      },
    });

    await tx.transaction.create({
      data: {
        userId: existingWithdrawal.userId,
        accountId: existingWithdrawal.accountId,
        type: "WITHDRAWAL",
        direction: "IN",
        amount: existingWithdrawal.amount,
        currency: existingWithdrawal.currency || "EUR",
        title: "Withdrawal Refund",
        description:
          status === "FAILED"
            ? "Refund for failed withdrawal request."
            : "Refund for cancelled withdrawal request.",
        beneficiaryName: existingWithdrawal.user.fullName,
        beneficiaryIban: existingWithdrawal.account.iban || null,
        beneficiaryBic: existingWithdrawal.account.bic || null,
        reference: refundReference,
        status: "COMPLETED",
      },
    });

    refunded = true;
  }
}

const withdrawal = await tx.transaction.update({
  where: { id: transactionId },
  data: {
    status,
    description: note || existingWithdrawal.description || undefined,
  },
  include: {
    user: true,
    account: true,
  },
});

await tx.notification.create({
  data: {
    userId: withdrawal.userId,
    type: "SYSTEM",
    title:
      status === "FAILED"
        ? "Withdrawal failed"
        : status === "CANCELLED"
        ? "Withdrawal cancelled"
        : status === "COMPLETED"
        ? "Withdrawal completed"
        : "Withdrawal processing",
    message: refunded
      ? `Your withdrawal request of ${withdrawal.amount} ${withdrawal.currency} has been updated to ${status}. The funds have been returned to your account.`
      : `Your withdrawal request is now ${status}.`,
  },
});

await tx.auditLog.create({
  data: {
    userId: admin.id,
    action: `WITHDRAWAL_${status}`,
    entity: "Transaction",
    entityId: withdrawal.id,
  },
});

return { withdrawal, refunded };
});

const { withdrawal, refunded } = result;

const content = getStatusContent(
  status,
  withdrawal.amount,
  withdrawal.currency || "EUR",
  refunded
);

try {
  await sendEmail({
    to: withdrawal.user.email,
    subject: content.subject,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2 style="color:#06183A;margin-top:24px;">${content.title}</h2>

          <p>Hello <strong>${withdrawal.user.fullName}</strong>,</p>
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
              withdrawal.amount,
              withdrawal.currency || "EUR"
            )}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Refund:</strong> ${
              refunded ? "Returned to account" : "Not applicable"
            }</p>
            <p><strong>Reference:</strong> ${
              withdrawal.reference || withdrawal.id
            }</p>
            <p><strong>Beneficiary:</strong> ${
              withdrawal.beneficiaryName || "Not provided"
            }</p>
            <p><strong>IBAN:</strong> ${
              withdrawal.beneficiaryIban || "Not provided"
            }</p>
          </div>

          <p style="font-size:13px;color:#64748b;">
            You can view this update from your secure Fluido Credit dashboard.
          </p>
        </div>
      </div>
    `,
  });
} catch (emailError) {
  console.error("ADMIN_WITHDRAWAL_EMAIL_ERROR:", emailError);
}

return NextResponse.redirect(`${APP_URL}/admin/withdrawals`);
} catch (error) {
console.error("ADMIN_WITHDRAWAL_STATUS_ERROR:", error);

return NextResponse.json(
  { message: "Unable to update withdrawal status." },
  { status: 500 }
);
}
}