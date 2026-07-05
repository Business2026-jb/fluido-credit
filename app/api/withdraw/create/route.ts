import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  sendWithdrawalCustomerEmail,
  sendWithdrawalAdminEmail,
  sendWithdrawalBeneficiaryEmail,
} from "@/lib/mail";

function generateReference() {
  return `FC-WD-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const amount = Number(body.amount);
    const method = String(body.method || "").trim();
    const destinationName = String(body.destinationName || "").trim();
    const destinationEmail = String(body.destinationEmail || "")
      .toLowerCase()
      .trim();
    const destinationIban = String(body.destinationIban || "")
      .replace(/\s+/g, "")
      .toUpperCase()
      .trim();
    const destinationBic = String(body.destinationBic || "")
      .toUpperCase()
      .trim();
    const description = String(body.description || "").trim();

    if (!amount || !method || !destinationName || !destinationIban) {
      return NextResponse.json(
        {
          message:
            "Amount, withdrawal method, beneficiary name and IBAN are required.",
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Withdrawal amount must be greater than 0." },
        { status: 400 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
        isActive: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { message: "Main account not found." },
        { status: 404 }
      );
    }

    if (account.availableBalance < amount) {
      return NextResponse.json(
        { message: "Insufficient available balance." },
        { status: 400 }
      );
    }

    const reference = generateReference();

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: account.id },
        data: {
          balance: account.balance - amount,
          availableBalance: account.availableBalance - amount,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: account.id,
          type: "WITHDRAWAL",
          direction: "OUT",
          amount,
          currency: account.currency,
          title: `Withdrawal to ${destinationName}`,
          description: description || `${method} withdrawal`,
          beneficiaryName: destinationName,
          beneficiaryIban: destinationIban,
          beneficiaryBic: destinationBic || null,
          reference,
          status: "PROCESSING",
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Withdrawal request received",
          message: `Your withdrawal request of ${amount} ${account.currency} has been received and will be processed within 24 business hours.`,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "WITHDRAWAL_CREATED",
          entity: "Transaction",
          entityId: reference,
        },
      });
    });

    try {
      await sendWithdrawalCustomerEmail(user.email, user.fullName, {
        amount,
        currency: account.currency,
        method,
        reference,
      });

      await sendWithdrawalAdminEmail({
        adminEmail: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        amount,
        currency: account.currency,
        method,
        destinationName,
        destinationIban,
        destinationBic: destinationBic || null,
        description: description || null,
        reference,
      });

      if (destinationEmail) {
        await sendWithdrawalBeneficiaryEmail({
          email: destinationEmail,
          beneficiaryName: destinationName,
          senderName: user.fullName,
          amount,
          currency: account.currency,
          reference,
        });
      }
    } catch (emailError) {
      console.error("WITHDRAWAL_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({
      message:
        "Withdrawal request created successfully. It will be processed within 24 business hours.",
      reference,
    });
  } catch (error) {
    console.error("WITHDRAW_CREATE_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to create withdrawal request." },
      { status: 500 }
    );
  }
}