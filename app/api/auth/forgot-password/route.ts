import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Réponse volontairement neutre pour la sécurité
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a reset code has been sent.",
      });
    }

    await prisma.passwordReset.updateMany({
      where: {
        email: normalizedEmail,
        status: "PENDING",
      },
      data: {
        status: "EXPIRED",
      },
    });

    const code = generateCode();

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log("FLUIDO RESET CODE:", code);
// await sendPasswordResetEmail(normalizedEmail, user.fullName, code);
    return NextResponse.json({
      message: "If this email exists, a reset code has been sent.",
    });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to process your request." },
      { status: 500 }
    );
  }
}