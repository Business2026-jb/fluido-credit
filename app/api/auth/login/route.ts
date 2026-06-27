import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getRequestInfo, SESSION_COOKIE_NAME } from "@/lib/auth";

const prismaClient = prisma as any;

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const { ipAddress, userAgent } = await getRequestInfo();

    const recentFailedAttempts = await prismaClient.loginAttempt.count({
      where: {
        email: normalizedEmail,
        success: false,
        createdAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000),
        },
      },
    });

    if (recentFailedAttempts >= 5) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      await prismaClient.loginAttempt.create({
        data: {
          email: normalizedEmail,
          success: false,
          ipAddress,
          userAgent,
        },
      });

      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      await prismaClient.loginAttempt.create({
        data: {
          userId: user.id,
          email: normalizedEmail,
          success: false,
          ipAddress,
          userAgent,
        },
      });

      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.emailVerified || !user.isActive) {
      return NextResponse.json(
        { message: "Please verify your email before signing in." },
        { status: 403 }
      );
    }

    const token = crypto.randomBytes(48).toString("hex");
    const sessionDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    await prismaClient.loginAttempt.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        success: true,
        ipAddress,
        userAgent,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_SUCCESS",
        entity: "User",
        entityId: user.id,
        ipAddress,
      },
    });

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDays * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      { message: "Login failed." },
      { status: 500 }
    );
  }
}