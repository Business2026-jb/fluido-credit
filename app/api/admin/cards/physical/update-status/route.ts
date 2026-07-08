import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/mail";
import { sendPushToUser } from "@/lib/push";

const APP_URL = "https://fluidocredit.com";

const VALID_STATUSES = [
  "IN_PRODUCTION",
  "SHIPPING",
  "DELIVERED",
  "ACTIVE",
  "CANCELLED",
] as const;

type PhysicalCardStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string): status is PhysicalCardStatus {
  return VALID_STATUSES.includes(status as PhysicalCardStatus);
}

function statusLabel(status: string) {
  if (status === "IN_PRODUCTION") return "Card in production";
  if (status === "SHIPPING") return "Card shipping";
  if (status === "DELIVERED") return "Card delivered";
  if (status === "ACTIVE") return "Card activated";
  if (status === "CANCELLED") return "Card cancelled";
  return status;
}

function getCustomerEmailContent(status: PhysicalCardStatus) {
  if (status === "IN_PRODUCTION") {
    return {
      subject: "Your Fluido Credit physical card is in production",
      title: "Card in production",
      message:
        "Your physical Fluido Credit VIP card is now being prepared by our card operations team.",
    };
  }

  if (status === "SHIPPING") {
    return {
      subject: "Your Fluido Credit physical card is on its way",
      title: "Card shipping",
      message:
        "Your physical Fluido Credit VIP card is now in delivery. Delivery usually takes up to 2 weeks.",
    };
  }

  if (status === "DELIVERED") {
    return {
      subject: "Your Fluido Credit physical card has arrived",
      title: "Card delivered",
      message:
        "Your physical Fluido Credit VIP card has arrived at the destination address.",
    };
  }

  if (status === "ACTIVE") {
    return {
      subject: "Your Fluido Credit physical card is active",
      title: "Card activated",
      message:
        "Your physical Fluido Credit VIP card is now active and visible from your Cards page.",
    };
  }

  return {
    subject: "Your Fluido Credit physical card has been cancelled",
    title: "Card cancelled",
    message:
      "Your physical Fluido Credit VIP card request has been cancelled. No physical card will be delivered for this request.",
  };
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const cardId = String(formData.get("cardId") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const adminNote = String(formData.get("adminNote") || "").trim();

    if (!cardId || !status) {
      return NextResponse.json(
        { message: "Card ID and status are required." },
        { status: 400 }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        { message: "Invalid physical card status." },
        { status: 400 }
      );
    }

    const physicalCard = await prisma.physicalCardRequest.update({
      where: { id: cardId },
      data: {
        status,
        adminNote: adminNote || null,
        activatedAt: status === "ACTIVE" ? new Date() : undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      },
      include: {
        user: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: physicalCard.userId,
        type: "SYSTEM",
        title: statusLabel(status),
        message:
          status === "CANCELLED"
            ? `Your physical card request has been cancelled.`
            : `Your physical card status has been updated: ${statusLabel(
                status
              )}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: `PHYSICAL_CARD_${status}`,
        entity: "PhysicalCardRequest",
        entityId: physicalCard.id,
      },
    });

    try {
      const content = getCustomerEmailContent(status);

      await sendEmail({
        to: physicalCard.user.email,
        subject: content.subject,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
            <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
              <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>

              <h2 style="color:#06183A;margin-top:24px;">${content.title}</h2>

              <p>Hello <strong>${physicalCard.user.fullName}</strong>,</p>

              <p>${content.message}</p>

              ${
                adminNote
                  ? `<div style="background:#eef5ff;border-radius:18px;padding:18px;margin:24px 0;">
                      <strong>Admin note:</strong>
                      <p style="margin-bottom:0;">${adminNote}</p>
                    </div>`
                  : ""
              }

              <div style="background:#f8fafc;border-radius:18px;padding:18px;margin:24px 0;">
                <p><strong>Status:</strong> ${statusLabel(status)}</p>
                <p><strong>Card:</strong> ${
                  physicalCard.maskedNumber || "Physical VIP Card"
                }</p>
                <p><strong>Delivery country:</strong> ${
                  physicalCard.country
                }</p>
                <p><strong>Delivery city:</strong> ${physicalCard.city}</p>
                <p><strong>Delivery address:</strong> ${
                  physicalCard.deliveryAddress
                }</p>
                <p><strong>Request ID:</strong> ${physicalCard.id}</p>
              </div>

              <p style="font-size:13px;color:#64748b;">
                You can follow your physical card status from your secure Fluido Credit Cards page.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
  console.error("PHYSICAL_CARD_STATUS_EMAIL_ERROR:", emailError);
}

await sendPushToUser({
  userId: physicalCard.userId,
  title: "Physical card update",
  message: `Your physical card status is now ${status}.`,
  url: "/cards",
});

return NextResponse.redirect(`${APP_URL}/admin/cards/physical`);
  } catch (error) {
    console.error("ADMIN_PHYSICAL_CARD_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update physical card status." },
      { status: 500 }
    );
  }
}