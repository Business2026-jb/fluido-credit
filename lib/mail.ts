import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, fullName: string, code: string) {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Your Fluido Credit verification code",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;font-size:26px;">Fluido Credit</h1>
          <h2 style="color:#06183A;margin-top:24px;">Verify your email address</h2>
          <p style="color:#334155;">Hello ${fullName},</p>
          <p style="color:#334155;">Use this secure verification code to activate your Fluido Credit account.</p>
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;text-align:center;background:#eef5ff;color:#062B8C;border-radius:18px;padding:22px;margin:26px 0;">
            ${code}
          </div>
          <p style="color:#334155;">This code expires in 10 minutes.</p>
          <p style="font-size:13px;color:#64748b;">For your security, never share this code with anyone.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:12px;color:#94a3b8;">Fluido Credit Security Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Welcome to Fluido Credit",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;font-size:26px;">Fluido Credit</h1>
          <h2 style="color:#06183A;margin-top:24px;">Welcome, ${fullName}</h2>
          <p style="color:#334155;">Your account has been successfully verified.</p>
          <p style="color:#334155;">You can now access your secure dashboard and start your loan application.</p>
          <div style="background:#062B8C;color:white;border-radius:18px;padding:18px;text-align:center;font-weight:700;margin:26px 0;">
            Your secure account is now active
          </div>
          <p style="font-size:13px;color:#64748b;">For your security, never share your password or verification codes.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:12px;color:#94a3b8;">Fluido Credit Customer Care</p>
        </div>
      </div>
    `,
  });
}