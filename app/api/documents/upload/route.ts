import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { uploadDocumentToStorage } from "../../../../lib/storage";
import {
  sendDocumentCustomerEmail,
  sendDocumentAdminEmail,
} from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();

    const type = String(formData.get("type") || "").trim();
    const loanApplicationId = String(
      formData.get("loanApplicationId") || ""
    ).trim();

    const file = formData.get("file");

    if (!type) {
      return NextResponse.json(
        { message: "Document type is required." },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Document file is required." },
        { status: 400 }
      );
    }

    const uploadedFile = await uploadDocumentToStorage({
      file,
      userId: user.id,
      type,
    });

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        loanApplicationId: loanApplicationId || null,
        type,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Document received",
        message:
          "Your document has been received and will be reviewed within 24 business hours.",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "DOCUMENT_UPLOADED",
        entity: "Document",
        entityId: document.id,
      },
    });

    try {
      await sendDocumentCustomerEmail(user.email, user.fullName, {
        documentType: type,
        fileName: uploadedFile.fileName,
      });

      await sendDocumentAdminEmail({
        adminEmail: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        documentType: type,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl,
        documentId: document.id,
      });
    } catch (emailError) {
      console.error("DOCUMENT_EMAIL_ERROR:", emailError);
    }

    return NextResponse.redirect(new URL("/documents", req.url));
  } catch (error) {
    console.error("DOCUMENT_UPLOAD_ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload document.",
      },
      { status: 500 }
    );
  }
}