import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const { title, description, amount, type, direction } = body;

    if (!title || !amount || !type || !direction) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
      },
    });

    if (!account) {
      return NextResponse.json(
        { message: "Main account not found." },
        { status: 404 }
      );
    }

    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0." },
        { status: 400 }
      );
    }

    const newBalance =
      direction === "IN"
        ? account.balance + numericAmount
        : account.balance - numericAmount;

    const newAvailableBalance =
      direction === "IN"
        ? account.availableBalance + numericAmount
        : account.availableBalance - numericAmount;

    if (direction === "OUT" && account.availableBalance < numericAmount) {
      return NextResponse.json(
        { message: "Insufficient available balance." },
        { status: 400 }
      );
    }

    const reference = `FC-TX-${Date.now()}-${Math.floor(
      Math.random() * 9999
    )}`;

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: account.id,
          type,
          direction,
          amount: numericAmount,
          currency: account.currency,
          title,
          description: description || null,
          reference,
          status: "COMPLETED",
        },
      });

      const updatedAccount = await tx.account.update({
        where: { id: account.id },
        data: {
          balance: newBalance,
          availableBalance: newAvailableBalance,
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Transaction completed",
          message: `${title} of ${numericAmount} ${account.currency} has been completed.`,
        },
      });

      return { transaction, updatedAccount };
    });

    return NextResponse.json({
      message: "Transaction created successfully.",
      ...result,
    });
  } catch (error) {
    console.error("CREATE_TRANSACTION_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to create transaction." },
      { status: 500 }
    );
  }
}