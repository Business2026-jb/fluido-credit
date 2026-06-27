import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.titan.email",
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
export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  code: string
) {
  return transporter.sendMail({
    from: `"Fluido Credit Security" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Reset your Fluido Credit password",
    html: `
      <div style="font-family:Arial,sans-serif;padding:40px;background:#f5f7fb">
        <div style="max-width:600px;margin:auto;background:white;border-radius:16px;padding:40px">

          <h2 style="color:#062B8C;margin-bottom:20px">
            Password Reset Request
          </h2>

          <p>Hello <strong>${fullName}</strong>,</p>

          <p>
            We received a request to reset your Fluido Credit account password.
          </p>

          <p>
            Use the verification code below:
          </p>

          <div
            style="
              font-size:38px;
              font-weight:bold;
              letter-spacing:8px;
              text-align:center;
              margin:30px 0;
              color:#062B8C;
            "
          >
            ${code}
          </div>

          <p>
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <hr style="margin:35px 0">

          <small style="color:#666">
            Fluido Credit Security Center
          </small>

        </div>
      </div>
    `,
  });
}