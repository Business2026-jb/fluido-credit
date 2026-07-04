import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const transactionId = String(formData.get("transactionId") || "");
    const status = String(formData.get("status") || "");
    const note = String(formData.get("note") || "").trim();

    if (!transactionId || !status) {
      return NextResponse.json(
        { message: "Transaction ID and status are required." },
        { status: 400 }
      );
    }

    if (!["PROCESSING", "COMPLETED", "FAILED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid withdrawal status." },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status as any,
        description: note || undefined,
      },
      include: {
        user: true,
        account: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: withdrawal.userId,
        type: "SYSTEM",
        title: "Withdrawal status updated",
        message: `Your withdrawal request is now ${status}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: `WITHDRAWAL_${status}`,
        entity: "Transaction",
        entityId: withdrawal.id,
      },
    });

    return NextResponse.redirect(new URL("/admin/withdrawals", req.url));
  } catch (error) {
    console.error("ADMIN_WITHDRAWAL_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update withdrawal status." },
      { status: 500 }
    );
  }
}