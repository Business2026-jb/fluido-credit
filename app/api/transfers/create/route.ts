import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function cleanIban(value: string) {
  return value.replace(/\s+/g, "").toUpperCase().trim();
}

function generateReference() {
  return `FC-TR-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const beneficiaryName = String(body.beneficiaryName || "").trim();
    const beneficiaryIban = cleanIban(String(body.beneficiaryIban || ""));
    const beneficiaryBic = String(body.beneficiaryBic || "").toUpperCase().trim();
    const description = String(body.description || "").trim();
    const amount = Number(body.amount);

    if (!beneficiaryName || !beneficiaryIban || !amount) {
      return NextResponse.json(
        { message: "Beneficiary name, IBAN and amount are required." },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0." },
        { status: 400 }
      );
    }

    const senderAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
        isActive: true,
      },
    });

    if (!senderAccount) {
      return NextResponse.json(
        { message: "Main account not found." },
        { status: 404 }
      );
    }

    if (senderAccount.availableBalance < amount) {
      return NextResponse.json(
        { message: "Insufficient available balance." },
        { status: 400 }
      );
    }

    if (senderAccount.iban === beneficiaryIban) {
      return NextResponse.json(
        { message: "You cannot transfer money to your own account." },
        { status: 400 }
      );
    }

    const receiverAccount = await prisma.account.findFirst({
      where: {
        iban: beneficiaryIban,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    const reference = generateReference();

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: senderAccount.id },
        data: {
          balance: senderAccount.balance - amount,
          availableBalance: senderAccount.availableBalance - amount,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: senderAccount.id,
          type: "TRANSFER",
          direction: "OUT",
          amount,
          currency: senderAccount.currency,
          title: `Transfer to ${beneficiaryName}`,
          description: description || "Bank transfer",
          beneficiaryName,
          beneficiaryIban,
          beneficiaryBic: beneficiaryBic || null,
          reference,
          status: receiverAccount ? "COMPLETED" : "PROCESSING",
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Transfer created",
          message: `Your transfer of ${amount} ${senderAccount.currency} to ${beneficiaryName} has been created.`,
        },
      });

      if (receiverAccount) {
        await tx.account.update({
          where: { id: receiverAccount.id },
          data: {
            balance: receiverAccount.balance + amount,
            availableBalance: receiverAccount.availableBalance + amount,
          },
        });

        await tx.transaction.create({
          data: {
            userId: receiverAccount.userId,
            accountId: receiverAccount.id,
            type: "TRANSFER",
            direction: "IN",
            amount,
            currency: receiverAccount.currency,
            title: `Transfer from ${user.fullName}`,
            description: description || "Incoming Fluido transfer",
            beneficiaryName: user.fullName,
            beneficiaryIban: senderAccount.iban,
            beneficiaryBic: senderAccount.bic,
            reference: `${reference}-IN`,
            status: "COMPLETED",
          },
        });

        await tx.notification.create({
          data: {
            userId: receiverAccount.userId,
            type: "SYSTEM",
            title: "Money received",
            message: `You received ${amount} ${receiverAccount.currency} from ${user.fullName}.`,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "TRANSFER_CREATED",
          entity: "Transaction",
          entityId: reference,
        },
      });
    });

    return NextResponse.json({
      message: receiverAccount
        ? "Internal transfer completed successfully."
        : "External transfer created and is now processing.",
      reference,
    });
  } catch (error) {
    console.error("TRANSFER_CREATE_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to create transfer." },
      { status: 500 }
    );
  }
}