import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { uploadDocumentToStorage } from "@/lib/storage";
import { sendEmail } from "@/lib/mail";
import { FLUIDO_BIC, generateFluidoIban } from "@/lib/banking";

const APP_URL = "https://fluidocredit.com";

const VALID_METHODS = ["USDT_TRC20", "BANK_TRANSFER"] as const;

type DepositMethod = (typeof VALID_METHODS)[number];

function isValidMethod(method: string): method is DepositMethod {
  return VALID_METHODS.includes(method as DepositMethod);
}

function generateReference() {
  return `FC-DP-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
}

function formatMoney(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function methodLabel(method: DepositMethod) {
  return method === "USDT_TRC20"
    ? "USDT Deposit - TRX Tron TRC20"
    : "Bank Transfer Deposit";
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();

    const amount = Number(formData.get("amount"));
    const currency = String(formData.get("currency") || "EUR").trim();
    const method = String(formData.get("method") || "").trim();
    const proof = formData.get("proof");

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Valid deposit amount is required." },
        { status: 400 }
      );
    }

    if (!isValidMethod(method)) {
      return NextResponse.json(
        { message: "Invalid deposit method." },
        { status: 400 }
      );
    }

    if (!proof || !(proof instanceof File)) {
      return NextResponse.json(
        { message: "Payment proof file is required." },
        { status: 400 }
      );
    }

    let account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
        isActive: true,
      },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          userId: user.id,
          name: "Main account",
          type: "MAIN",
          currency: "EUR",
          balance: 0,
          availableBalance: 0,
          blockedBalance: 0,
          iban: generateFluidoIban(user.id),
          bic: FLUIDO_BIC,
          isActive: true,
        },
      });
    }

    const reference = generateReference();

    const uploadedProof = await uploadDocumentToStorage({
      file: proof,
      userId: user.id,
      type: "deposit-proof",
    });

    const deposit = await prisma.depositRequest.create({
      data: {
        userId: user.id,
        accountId: account.id,
        amount,
        currency,
        method,
        status: "PENDING",
        reference,
        proofFileName: uploadedProof.fileName,
        proofFileUrl: uploadedProof.fileUrl,
      },
    });

    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: account.id,
        type: "DEPOSIT",
        direction: "IN",
        amount,
        currency,
        title: `Deposit request - ${methodLabel(method)}`,
        description: "Deposit request submitted and waiting for admin validation.",
        reference,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Deposit request submitted",
        message: `Your deposit request of ${formatMoney(
          amount,
          currency
        )} has been submitted and is waiting for admin validation.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "DEPOSIT_REQUEST_CREATED",
        entity: "DepositRequest",
        entityId: deposit.id,
      },
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Fluido Credit deposit request has been received",
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
              <h2>Deposit request received</h2>

              <p>Hello <strong>${user.fullName}</strong>,</p>
              <p>Your deposit request has been received and is now waiting for admin validation.</p>

              <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
                <p><strong>Amount:</strong> ${formatMoney(amount, currency)}</p>
                <p><strong>Method:</strong> ${methodLabel(method)}</p>
                <p><strong>Reference:</strong> ${reference}</p>
                <p><strong>Status:</strong> Pending validation</p>
              </div>

              <p style="font-size:13px;color:#64748b;">
                Your Fluido balance will be credited after payment confirmation by our team.
              </p>
            </div>
          </div>
        `,
      });

      await sendEmail({
        to: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
        subject: `New deposit request - ${user.fullName}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:680px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit Admin</h1>
              <h2>New deposit request</h2>

              <p><strong>Customer:</strong> ${user.fullName}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Phone:</strong> ${user.phone}</p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

              <p><strong>Amount:</strong> ${formatMoney(amount, currency)}</p>
              <p><strong>Method:</strong> ${methodLabel(method)}</p>
              <p><strong>Reference:</strong> ${reference}</p>
              <p><strong>Deposit ID:</strong> ${deposit.id}</p>
              <p><strong>Proof file:</strong> ${uploadedProof.fileName}</p>
              <p><strong>Proof path:</strong> ${uploadedProof.fileUrl}</p>

              <p style="margin-top:24px;">
                Review this deposit from the Fluido Credit admin dashboard:
                <br />
                <strong>${APP_URL}/admin/deposits</strong>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("DEPOSIT_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({
      message: "Deposit request submitted successfully.",
      reference,
      depositId: deposit.id,
    });
  } catch (error) {
    console.error("DEPOSIT_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit deposit request.",
      },
      { status: 500 }
    );
  }
}