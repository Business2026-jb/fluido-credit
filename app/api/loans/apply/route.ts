import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  sendLoanApplicationAdminEmail,
  sendLoanApplicationCustomerEmail,
} from "@/lib/mail";

function calculateLoan(amount: number, durationMonths: number) {
  const annualRate = 6.9;
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -durationMonths));

  const totalAmountDue = monthlyPayment * durationMonths;
  const totalInterest = totalAmountDue - amount;

  return {
    annualRate,
    monthlyPayment,
    totalAmountDue,
    totalInterest,
  };
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      amount,
      durationMonths,
      purpose,
      monthlyIncome,
      employmentStatus,
      employerName,
      monthlyExpenses,
      existingLoans,
      housingStatus,
      maritalStatus,
      children,
    } = body;

    if (!amount || !durationMonths || !purpose || !monthlyIncome || !employmentStatus) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    const numericDuration = Number(durationMonths);

    if (numericAmount < 1000 || numericAmount > 50000) {
      return NextResponse.json(
        { message: "Loan amount must be between €1,000 and €50,000." },
        { status: 400 }
      );
    }

    const calculation = calculateLoan(numericAmount, numericDuration);

    const loan = await prisma.loanApplication.create({
      data: {
        userId: user.id,
        amount: numericAmount,
        durationMonths: numericDuration,
        annualRate: calculation.annualRate,
        monthlyPayment: calculation.monthlyPayment,
        totalAmountDue: calculation.totalAmountDue,
        totalInterest: calculation.totalInterest,
        purpose: `${purpose} | Income: €${monthlyIncome} | Employment: ${employmentStatus} | Employer: ${
          employerName || "N/A"
        } | Expenses: €${monthlyExpenses || 0} | Existing loans: ${
          existingLoans || "No"
        } | Housing: ${housingStatus || "N/A"} | Marital: ${
          maritalStatus || "N/A"
        } | Children: ${children || 0}`,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    await prisma.loanStatusHistory.create({
      data: {
        loanApplicationId: loan.id,
        status: "SUBMITTED",
        note: "Loan application submitted by customer.",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Loan application submitted",
        message: `Your loan request of €${numericAmount} has been submitted successfully.`,
      },
    });

    console.log("NEW LOAN APPLICATION:", {
      customer: user.fullName,
      email: user.email,
      amount: numericAmount,
      durationMonths: numericDuration,
      purpose,
      loanId: loan.id,
    });

    await sendLoanApplicationCustomerEmail(user.email, user.fullName, {
      amount: numericAmount,
      durationMonths: numericDuration,
      monthlyPayment: calculation.monthlyPayment,
      totalAmountDue: calculation.totalAmountDue,
      loanId: loan.id,
    });

    await sendLoanApplicationAdminEmail({
      adminEmail: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: user.phone,
      amount: numericAmount,
      durationMonths: numericDuration,
      monthlyPayment: calculation.monthlyPayment,
      totalAmountDue: calculation.totalAmountDue,
      purpose,
      loanId: loan.id,
    });

    return NextResponse.json({
      message: "Loan application submitted successfully.",
      loanId: loan.id,
    });
  } catch (error) {
    console.error("LOAN_APPLICATION_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to submit loan application." },
      { status: 500 }
    );
  }
}