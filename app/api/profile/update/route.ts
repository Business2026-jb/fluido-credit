import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const countryCode = String(formData.get("countryCode") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const postalCode = String(formData.get("postalCode") || "").trim();

    if (
      !fullName ||
      !phone ||
      !country ||
      !countryCode ||
      !city ||
      !address ||
      !postalCode
    ) {
      return NextResponse.json(
        { message: "All profile fields are required." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        phone,
        country,
        countryCode,
        city,
        address,
        postalCode,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Profile updated",
        message: "Your profile information has been updated successfully.",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PROFILE_UPDATED",
        entity: "User",
        entityId: user.id,
      },
    });

    return NextResponse.redirect(new URL("/profile", req.url));
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update profile." },
      { status: 500 }
    );
  }
}