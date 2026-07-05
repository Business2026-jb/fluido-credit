import { FLUIDO_BIC, generateFluidoIban } from "@/lib/banking";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendLoanStatusCustomerEmail } from "@/lib/mail";

const VALID_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "FUNDED",
  "REJECTED",
] as const;

type LoanStatus = (typeof VALID_STATUSES)[number];

function isValidLoanStatus(status: string): status is LoanStatus {
  return VALID_STATUSES.includes(status as LoanStatus);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function getCustomerEmailContent(status: LoanStatus, loanAmount: number, note: string) {
  const amount = formatMoney(loanAmount);

  if (status === "UNDER_REVIEW") {
    return {
      subject: "Your Fluido Credit loan is under review",
      title: "Loan under review",
      message: `Your loan request of ${amount} is now being reviewed by our financing team.`,
    };
  }

  if (status === "APPROVED") {
    return {
      subject: "Your Fluido Credit loan has been approved",
      title: "Loan approved",
      message: `Your loan request of ${amount} has been approved. The funds will be released after final funding validation.`,
    };
  }

  if (status === "FUNDED") {
    return {
      subject: "Your Fluido Credit loan has been funded",
      title: "Funds credited",
      message: `Your approved loan of ${amount} has been credited to your Fluido Credit account.`,
    };
  }

  if (status === "REJECTED") {
    return {
      subject: "Update on your Fluido Credit loan request",
      title: "Loan request not approved",
      message: `After review, your loan request of ${amount} could not be approved at this time.`,
    };
  }

  return {
    subject: "Your Fluido Credit loan status has been updated",
    title: "Loan status updated",
    message: `Your loan request of ${amount} has been updated.`,
  };
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const loanId = String(formData.get("loanId") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const note = String(formData.get("note") || "").trim();

    if (!loanId || !status) {
      return NextResponse.json(
        { message: "Loan ID and status are required." },
        { status: 400 }
      );
    }

    if (!isValidLoanStatus(status)) {
      return NextResponse.json(
        { message: "Invalid loan status." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const loan = await tx.loanApplication.findUnique({
          where: { id: loanId },
          include: { user: true },
        });

        if (!loan) {
          throw new Error("Loan not found.");
        }

        let credited = false;

        if (status === "FUNDED" && loan.status !== "FUNDED") {
          let account = await tx.account.findFirst({
            where: {
              userId: loan.userId,
              type: "MAIN",
            },
          });

          if (!account) {
            account = await tx.account.create({
              data: {
                userId: loan.userId,
                name: "Main account",
                type: "MAIN",
                currency: "EUR",
                balance: 0,
                availableBalance: 0,
                blockedBalance: 0,
                iban: generateFluidoIban(loan.userId),
                bic: FLUIDO_BIC,
                isActive: true,
              },
            });
          }

          const reference = `LOAN-DISBURSEMENT-${loan.id}`;

          const existingTransaction = await tx.transaction.findFirst({
            where: { reference },
          });

          if (!existingTransaction) {
            await tx.account.update({
              where: { id: account.id },
              data: {
                balance: { increment: loan.amount },
                availableBalance: { increment: loan.amount },
              },
            });

            await tx.transaction.create({
              data: {
                userId: loan.userId,
                accountId: account.id,
                title: "Loan Disbursement",
                description: "Loan funds credited to your Fluido Credit account.",
                amount: loan.amount,
                currency: account.currency || "EUR",
                direction: "IN",
                type: "LOAN",
                status: "COMPLETED",
                reference,
              },
            });

            credited = true;
          }
        }

        await tx.loanApplication.update({
          where: { id: loan.id },
          data: { status },
        });

        await tx.loanStatusHistory.create({
          data: {
            loanApplicationId: loan.id,
            status,
            note: note || null,
          },
        });

        return {
          loanId: loan.id,
          loanUserId: loan.userId,
          loanAmount: loan.amount,
          customerEmail: loan.user.email,
          customerName: loan.user.fullName,
          credited,
        };
      },
      { timeout: 20000 }
    );

    const content = getCustomerEmailContent(status, result.loanAmount, note);

    await prisma.notification.create({
      data: {
        userId: result.loanUserId,
        type: "SYSTEM",
        title: content.title,
        message: content.message,
      },
    });

    await sendLoanStatusCustomerEmail({
  email: result.customerEmail,
  fullName: result.customerName,
  status,
  amount: result.loanAmount,
  loanId: result.loanId,
  note: note || null,
});

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action:
          status === "FUNDED"
            ? "LOAN_FUNDED"
            : status === "APPROVED"
            ? "LOAN_APPROVED"
            : status === "REJECTED"
            ? "LOAN_REJECTED"
            : "LOAN_STATUS_UPDATED",
        entity: "LoanApplication",
        entityId: loanId,
      },
    });

return NextResponse.redirect("https://fluidocredit.com/admin/loans");
  } catch (error) {
    console.error("ADMIN_LOAN_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update loan status." },
      { status: 500 }
    );
  }
}