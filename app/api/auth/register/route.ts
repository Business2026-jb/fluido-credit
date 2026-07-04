import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateIban(userId: string) {
  const clean = userId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = clean.slice(-20).padStart(20, "0");
  return `FR76${suffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      country,
      countryCode,
      city,
      address,
      postalCode,
      password,
    } = body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !country ||
      !countryCode ||
      !city ||
      !address ||
      !postalCode ||
      !password
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser?.emailVerified) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = existingUser
      ? await prisma.user.update({
          where: { email: normalizedEmail },
          data: {
            fullName,
            phone,
            country,
            countryCode,
            city,
            address,
            postalCode,
            passwordHash,
            isActive: false,
            emailVerified: false,
          },
        })
      : await prisma.user.create({
          data: {
            fullName,
            email: normalizedEmail,
            phone,
            country,
            countryCode,
            city,
            address,
            postalCode,
            passwordHash,
          },
        });

    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
      },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: user.id,
          name: "Main account",
          type: "MAIN",
          currency: "EUR",
          balance: 0,
          availableBalance: 0,
          blockedBalance: 0,
          iban: generateIban(user.id),
          bic: "FLCRFRP1",
          isActive: true,
        },
      });
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

    console.log("FLUIDO VERIFICATION CODE:", code);

    await sendVerificationEmail(normalizedEmail, fullName, code);

    return NextResponse.json({
      message: "Account created. Verification code sent.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      { message: "Registration failed." },
      { status: 500 }
    );
  }
}