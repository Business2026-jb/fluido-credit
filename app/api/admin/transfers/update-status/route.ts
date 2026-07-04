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
        { message: "Invalid transfer status." },
        { status: 400 }
      );
    }

    const transfer = await prisma.transaction.update({
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
        userId: transfer.userId,
        type: "SYSTEM",
        title: "Transfer status updated",
        message: `Your transfer is now ${status}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: `TRANSFER_${status}`,
        entity: "Transaction",
        entityId: transfer.id,
      },
    });

    return NextResponse.redirect(new URL("/admin/transfers", req.url));
  } catch (error) {
    console.error("ADMIN_TRANSFER_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update transfer status." },
      { status: 500 }
    );
  }
}