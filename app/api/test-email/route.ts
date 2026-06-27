import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Fluido Credit" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_USER,
      subject: "Fluido Credit SMTP Test",
      html: `
        <h2>SMTP Test Successful</h2>

        <p>If you receive this email, Titan SMTP is working correctly.</p>

        <p><strong>Fluido Credit</strong></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });
  }
}