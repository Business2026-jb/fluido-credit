import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { DOCUMENTS_BUCKET, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const path = String(searchParams.get("path") || "").trim();
    const download = searchParams.get("download") === "1";

    if (!path) {
      return NextResponse.json(
        { message: "File path is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.storage
      .from(DOCUMENTS_BUCKET)
      .download(path);

    if (error || !data) {
      console.error("DEPOSIT_PROOF_DOWNLOAD_ERROR:", error);

      return NextResponse.json(
        { message: "Unable to load deposit proof." },
        { status: 404 }
      );
    }

    const fileName = path.split("/").pop() || "deposit-proof";
    const headers = new Headers();

    headers.set(
      "Content-Type",
      data.type || "application/octet-stream"
    );

    headers.set(
      "Content-Disposition",
      `${download ? "attachment" : "inline"}; filename="${fileName}"`
    );

    headers.set("Cache-Control", "private, no-store");

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("DEPOSIT_PROOF_ROUTE_ERROR:", error);

    return NextResponse.json(
      { message: "Unauthorized or unable to open file." },
      { status: 401 }
    );
  }
}