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
    const { action } = body;

    if (!action) {
      return NextResponse.json({ message: "Action is required." }, { status: 400 });
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Card security update",
        message: `Card action requested: ${action}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `CARD_${String(action).toUpperCase()}`,
        entity: "Card",
        entityId: user.id,
      },
    });

    return NextResponse.json({
      message: "Card action saved successfully.",
    });
  } catch (error) {
    console.error("CARD_UPDATE_ERROR:", error);
    return NextResponse.json(
      { message: "Unable to update card." },
      { status: 500 }
    );
  }
}