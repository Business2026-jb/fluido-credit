import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function GET() {
  try {
    await sendEmail({
      to: process.env.FLUIDO_ADMIN_EMAIL || "user@fluidocredit.com",
      subject: "Fluido Credit SMTP Test",
      html: `
        <div style="font-family:Arial;padding:30px">
          <h2>Fluido Credit</h2>
          <p>SMTP connection is working correctly.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Test email sent successfully.",
    });
  } catch (error) {
    console.error("SMTP_TEST_ERROR:", error);

    return NextResponse.json(
      {
        message: "Email test failed.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}