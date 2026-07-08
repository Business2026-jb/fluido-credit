import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendDocumentDecisionCustomerEmail } from "@/lib/mail";
import { sendPushToUser } from "@/lib/push";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fluidocredit.com";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const documentId = String(formData.get("documentId") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const rejectionReason = String(formData.get("rejectionReason") || "").trim();

    if (!documentId || !status) {
      return NextResponse.json(
        { message: "Document ID and status are required." },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid document status." },
        { status: 400 }
      );
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: status as "APPROVED" | "REJECTED" | "PENDING",
        rejectionReason: status === "REJECTED" ? rejectionReason || null : null,
        reviewComment: rejectionReason || null,
        reviewedAt: new Date(),
        reviewedById: admin.id,
      },
      include: {
        user: true,
        reviewedBy: true,
        loanApplication: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: document.userId,
        type: "SYSTEM",
        title:
          status === "APPROVED"
            ? "Document approved"
            : status === "REJECTED"
            ? "Document rejected"
            : "More information required",
        message:
          status === "APPROVED"
            ? `Your document "${document.fileName}" has been approved.`
            : status === "REJECTED"
            ? `Your document "${document.fileName}" was rejected. ${
                rejectionReason || "Please upload a valid document."
              }`
            : `More information is required for "${document.fileName}". ${
                rejectionReason || "Please upload additional information."
              }`,
      },
    });

    try {
      await sendDocumentDecisionCustomerEmail(
        document.user.email,
        document.user.fullName,
        {
          documentType: document.type,
          fileName: document.fileName,
          status: status as "APPROVED" | "REJECTED" | "PENDING",
          reason: rejectionReason || null,
        }
      );
    } catch (emailError) {
  console.error("DOCUMENT_DECISION_EMAIL_ERROR:", emailError);
}

await sendPushToUser({
  userId: document.userId,
  title:
    status === "APPROVED"
      ? "Document approved"
      : status === "REJECTED"
      ? "Document rejected"
      : "Document update",
  message:
    status === "APPROVED"
      ? "Your document has been approved."
      : status === "REJECTED"
      ? "Your document was rejected. Please check your account."
      : "More information is required for your document.",
  url: "/documents",
});

await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action:
          status === "APPROVED"
            ? "DOCUMENT_APPROVED"
            : status === "REJECTED"
            ? "DOCUMENT_REJECTED"
            : "DOCUMENT_MORE_INFORMATION_REQUESTED",
        entity: "Document",
        entityId: document.id,
      },
    });

    return NextResponse.redirect(`${APP_URL}/admin/documents`);
  } catch (error) {
    console.error("ADMIN_DOCUMENT_STATUS_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update document status." },
      { status: 500 }
    );
  }
}