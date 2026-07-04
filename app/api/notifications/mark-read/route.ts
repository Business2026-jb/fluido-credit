import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const notificationId = String(
      formData.get("notificationId") || ""
    );

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required." },
        { status: 400 }
      );
    }

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.redirect(
      new URL("/notifications", req.url)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to update notification." },
      { status: 500 }
    );
  }
}