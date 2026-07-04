import { FLUIDO_BIC, generateFluidoIban } from "@/lib/banking";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const VALID_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "FUNDED",
  "REJECTED",
] as const;

type LoanStatus = (typeof VALID_STATUSES)[number];

function generateIban(userId: string) {
  return `FR76${userId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-20)
    .padStart(20, "0")
    .toUpperCase()}`;
}

function isValidLoanStatus(status: string): status is LoanStatus {
  return VALID_STATUSES.includes(status as LoanStatus);
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
          loanUserId: loan.userId,
          loanAmount: loan.amount,
          credited,
        };
      },
      {
        timeout: 20000,
      }
    );

    if (status === "FUNDED" && result.credited) {
      await prisma.notification.create({
        data: {
          userId: result.loanUserId,
          type: "SYSTEM",
          title: "Loan Funded",
          message: `Your approved loan of ${result.loanAmount} EUR has been credited to your account.`,
        },
      });
    }

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

    return NextResponse.redirect(new URL("/admin/loans", req.url));
  } catch (error) {
    console.error("ADMIN_LOAN_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update loan status." },
      { status: 500 }
    );
  }
}