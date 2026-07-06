import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function cleanIban(value: string) {
  return value.replace(/\s+/g, "").toUpperCase().trim();
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) return "Protected email";

  return `${name.slice(0, 2)}***@${domain}`;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const iban = cleanIban(String(body.iban || ""));

    if (!iban) {
      return NextResponse.json(
        { message: "IBAN is required." },
        { status: 400 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        iban,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!account || account.userId === user.id) {
      return NextResponse.json({
        found: false,
        type: "EXTERNAL",
      });
    }

    return NextResponse.json({
      found: true,
      type: "FLUIDO",
      beneficiaryName: account.user.fullName,
      maskedEmail: maskEmail(account.user.email),
    });
  } catch (error) {
    console.error("RESOLVE_IBAN_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to verify IBAN." },
      { status: 500 }
    );
  }
}