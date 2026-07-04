import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DOCUMENTS_BUCKET, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { message: "Document ID is required." },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { user: true },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found." },
        { status: 404 }
      );
    }

    const isOwner = document.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(document.fileUrl, 60);

    if (error || !data?.signedUrl) {
      console.error("SIGNED_URL_ERROR:", error);
      return NextResponse.json(
        { message: "Unable to open document." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error("DOCUMENT_VIEW_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to open document." },
      { status: 500 }
    );
  }
}