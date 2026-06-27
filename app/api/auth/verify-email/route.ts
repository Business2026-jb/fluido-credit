import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: normalizedEmail,
        code,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    if (!verification) {
      return NextResponse.json({ message: "Invalid or expired verification code." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: verification.userId },
      data: {
        emailVerified: true,
        isActive: true,
      },
    });

    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { status: "VERIFIED" },
    });

    await sendWelcomeEmail(normalizedEmail, verification.user.fullName);

    return NextResponse.json({ message: "Account verified successfully." });
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR:", error);
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}