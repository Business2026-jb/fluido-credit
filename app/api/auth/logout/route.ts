import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

async function logout(req: Request, redirectToLogin = false) {
  const token = req.headers
    .get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  const response = redirectToLogin
    ? NextResponse.redirect(new URL("/login", req.url))
    : NextResponse.json({ message: "Logged out." });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST(req: Request) {
  return logout(req, false);
}

export async function GET(req: Request) {
  return logout(req, true);
}