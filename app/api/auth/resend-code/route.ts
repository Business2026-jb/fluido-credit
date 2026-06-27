import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Account already verified." }, { status: 400 });
    }

    await prisma.emailVerification.updateMany({
      where: { email: normalizedEmail, status: "PENDING" },
      data: { status: "EXPIRED" },
    });

    const code = generateCode();

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(normalizedEmail, user.fullName, code);

    return NextResponse.json({ message: "New verification code sent." });
  } catch (error) {
    console.error("RESEND_CODE_ERROR:", error);
    return NextResponse.json({ message: "Could not resend code." }, { status: 500 });
  }
}