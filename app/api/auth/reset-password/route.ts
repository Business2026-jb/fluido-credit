import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Email, code and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must contain at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const reset = await prisma.passwordReset.findFirst({
      where: {
        email: normalizedEmail,
        code,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    if (!reset) {
      return NextResponse.json(
        { message: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash },
    });

    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { status: "VERIFIED" },
    });

    await prisma.session.deleteMany({
      where: { userId: reset.userId },
    });

    await prisma.auditLog.create({
      data: {
        userId: reset.userId,
        action: "PASSWORD_RESET_SUCCESS",
        entity: "User",
        entityId: reset.userId,
      },
    });

    return NextResponse.json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to reset password." },
      { status: 500 }
    );
  }
}