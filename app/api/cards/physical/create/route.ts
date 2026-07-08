import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";

const APP_URL = "https://fluidocredit.com";

function generateCardNumber(userId: string) {
  const base = userId.replace(/[^0-9]/g, "").padEnd(12, "7").slice(0, 12);
  return `4579${base}`;
}

function formatCardNumber(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim();
}

function maskCardNumber(value: string) {
  return `•••• •••• •••• ${value.slice(-4)}`;
}

function generateCvv(userId: string) {
  const digits = userId
    .split("")
    .map((char) => char.charCodeAt(0))
    .join("");

  return digits.padEnd(3, "7").slice(0, 3);
}

function generateExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 4);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${year}`;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const country = String(body.country || "").trim();
    const city = String(body.city || "").trim();
    const deliveryAddress = String(body.deliveryAddress || "").trim();

    if (!country || !city || !deliveryAddress) {
      return NextResponse.json(
        {
          message: "Country, city and delivery address are required.",
        },
        { status: 400 }
      );
    }

    const existingPendingRequest =
      await prisma.physicalCardRequest.findFirst({
        where: {
          userId: user.id,
          status: {
            in: ["REQUESTED", "IN_PRODUCTION", "SHIPPING", "DELIVERED"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (existingPendingRequest) {
      return NextResponse.json(
        {
          message:
            "You already have a physical card request in progress.",
        },
        { status: 409 }
      );
    }

    const rawCardNumber = generateCardNumber(user.id);
    const formattedCardNumber = formatCardNumber(rawCardNumber);
    const maskedNumber = maskCardNumber(rawCardNumber);
    const expiry = generateExpiry();
    const cvv = generateCvv(user.id);

    const physicalCard = await prisma.physicalCardRequest.create({
      data: {
        userId: user.id,
        cardNumber: formattedCardNumber,
        maskedNumber,
        expiry,
        cvv,
        status: "REQUESTED",
        country,
        city,
        deliveryAddress,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Physical card request received",
        message:
          "Your physical Fluido Credit card request has been received. Delivery usually takes up to 2 weeks after validation.",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PHYSICAL_CARD_REQUEST_CREATED",
        entity: "PhysicalCardRequest",
        entityId: physicalCard.id,
      },
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Fluido Credit physical card request has been received",
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:650px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>

              <h2 style="color:#06183A;margin-top:24px;">Physical card request received</h2>

              <p>Hello <strong>${user.fullName}</strong>,</p>

              <p>
                Your request for a physical Fluido Credit VIP card has been received successfully.
              </p>

              <p>
                Our card operations team will review and prepare your card.
                Delivery usually takes up to <strong>2 weeks</strong> after validation.
              </p>

              <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
                <p><strong>Status:</strong> Requested</p>
                <p><strong>Delivery country:</strong> ${country}</p>
                <p><strong>Delivery city:</strong> ${city}</p>
                <p><strong>Delivery address:</strong> ${deliveryAddress}</p>
                <p><strong>Request ID:</strong> ${physicalCard.id}</p>
              </div>

              <p style="font-size:13px;color:#64748b;">
                You will receive another confirmation email when your physical card is activated or updated.
              </p>
            </div>
          </div>
        `,
      });

      await sendEmail({
        to: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
        subject: `New physical card request - ${user.fullName}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:700px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit Admin</h1>

              <h2 style="color:#06183A;margin-top:24px;">New physical card request</h2>

              <p>A customer has requested a physical Fluido Credit VIP card.</p>

              <div style="background:#f8fafc;border-radius:18px;padding:22px;margin:24px 0;">
                <p><strong>Customer:</strong> ${user.fullName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Country:</strong> ${user.country}</p>
                <p><strong>User ID:</strong> ${user.id}</p>
              </div>

              <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
                <p><strong>Delivery country:</strong> ${country}</p>
                <p><strong>Delivery city:</strong> ${city}</p>
                <p><strong>Delivery address:</strong> ${deliveryAddress}</p>
                <p><strong>Status:</strong> Requested</p>
                <p><strong>Request ID:</strong> ${physicalCard.id}</p>
              </div>

              <a href="${APP_URL}/admin/cards/physical"
                style="display:inline-block;background:#062B8C;color:white;padding:14px 22px;border-radius:14px;text-decoration:none;font-weight:bold;">
                Review Physical Card Request
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("PHYSICAL_CARD_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({
      message:
        "Physical card request created successfully. Delivery usually takes up to 2 weeks after validation.",
      cardRequestId: physicalCard.id,
      status: physicalCard.status,
    });
  } catch (error) {
    console.error("PHYSICAL_CARD_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create physical card request.",
      },
      { status: 500 }
    );
  }
}