import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      await prisma.platformSetting.update({
        where: { key },
        data: {
          value: String(value),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PLATFORM_SETTINGS_UPDATED",
        entity: "PlatformSetting",
        entityId: "platform_settings",
      },
    });

    return NextResponse.redirect(new URL("/admin/settings", req.url));
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update platform settings." },
      { status: 500 }
    );
  }
}