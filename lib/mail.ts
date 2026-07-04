import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing in .env");
  }

  return new Resend(apiKey);
}

const FROM_EMAIL = "Fluido Credit <user@fluidocredit.com>";

export async function verifyMailConnection() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return true;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text: text || subject,
  });
}

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  code: string
) {
  return sendEmail({
    to: email,
    subject: "Your Fluido Credit verification code",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;font-size:26px;">Fluido Credit</h1>
          <h2 style="color:#06183A;margin-top:24px;">Verify your email address</h2>
          <p>Hello ${fullName},</p>
          <p>Use this secure verification code to activate your Fluido Credit account.</p>
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;text-align:center;background:#eef5ff;color:#062B8C;border-radius:18px;padding:22px;margin:26px 0;">
            ${code}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p style="font-size:13px;color:#64748b;">Never share this code with anyone.</p>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Fluido Credit",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:560px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;">Fluido Credit</h1>
          <h2>Welcome, ${fullName}</h2>
          <p>Your account has been successfully verified.</p>
          <p>You can now access your secure dashboard.</p>
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
  return sendEmail({
    to: email,
    subject: "Reset your Fluido Credit password",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:40px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:16px;padding:40px;">
          <h2 style="color:#062B8C;">Password Reset Request</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Use the verification code below:</p>
          <div style="font-size:38px;font-weight:bold;letter-spacing:8px;text-align:center;margin:30px 0;color:#062B8C;">
            ${code}
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
        </div>
      </div>
    `,
  });
}

export async function sendLoanApplicationCustomerEmail(
  email: string,
  fullName: string,
  loan: {
    amount: number;
    durationMonths: number;
    monthlyPayment: number;
    totalAmountDue: number;
    loanId: string;
  }
) {
  return sendEmail({
    to: email,
    subject: "Your Fluido Credit loan application has been received",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit</h1>
          <h2>Loan application received</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your loan application has been submitted successfully.</p>
          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Requested amount:</strong> €${loan.amount}</p>
            <p><strong>Duration:</strong> ${loan.durationMonths} months</p>
            <p><strong>Monthly payment:</strong> €${loan.monthlyPayment.toFixed(2)}</p>
            <p><strong>Total due:</strong> €${loan.totalAmountDue.toFixed(2)}</p>
            <p><strong>Application ID:</strong> ${loan.loanId}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendLoanApplicationAdminEmail(data: {
  adminEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  durationMonths: number;
  monthlyPayment: number;
  totalAmountDue: number;
  purpose: string;
  loanId: string;
}) {
  return sendEmail({
    to: data.adminEmail,
    subject: `New loan application - ${data.customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:650px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit Admin</h1>
          <h2>New loan application received</h2>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>
          <p><strong>Amount:</strong> €${data.amount}</p>
          <p><strong>Duration:</strong> ${data.durationMonths} months</p>
          <p><strong>Monthly:</strong> €${data.monthlyPayment.toFixed(2)}</p>
          <p><strong>Total due:</strong> €${data.totalAmountDue.toFixed(2)}</p>
          <p><strong>Purpose:</strong> ${data.purpose}</p>
          <p><strong>Loan ID:</strong> ${data.loanId}</p>
        </div>
      </div>
    `,
  });
}

export async function sendWithdrawalCustomerEmail(
  email: string,
  fullName: string,
  data: {
    amount: number;
    currency: string;
    method: string;
    reference: string;
  }
) {
  return sendEmail({
    to: email,
    subject: "Your Fluido Credit withdrawal request has been received",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit</h1>
          <h2>Withdrawal request received</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your withdrawal request has been received successfully.</p>
          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
            <p><strong>Method:</strong> ${data.method}</p>
            <p><strong>Reference:</strong> ${data.reference}</p>
            <p><strong>Status:</strong> Processing</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendWithdrawalAdminEmail(data: {
  adminEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  method: string;
  destinationName: string;
  destinationIban: string;
  destinationBic?: string | null;
  description?: string | null;
  reference: string;
}) {
  return sendEmail({
    to: data.adminEmail,
    subject: `New withdrawal request - ${data.customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:680px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit Admin</h1>
          <h2>New withdrawal request</h2>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>
          <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
          <p><strong>Method:</strong> ${data.method}</p>
          <p><strong>Beneficiary:</strong> ${data.destinationName}</p>
          <p><strong>IBAN:</strong> ${data.destinationIban}</p>
          <p><strong>BIC:</strong> ${data.destinationBic || "Not provided"}</p>
          <p><strong>Description:</strong> ${data.description || "Not provided"}</p>
          <p><strong>Reference:</strong> ${data.reference}</p>
        </div>
      </div>
    `,
  });
}

export async function sendDocumentCustomerEmail(
  email: string,
  fullName: string,
  data: {
    documentType: string;
    fileName: string;
  }
) {
  return sendEmail({
    to: email,
    subject: "Your document has been received - Fluido Credit",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit</h1>
          <h2>Document received</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>We have received your document successfully.</p>
          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Document type:</strong> ${data.documentType}</p>
            <p><strong>File name:</strong> ${data.fileName}</p>
            <p><strong>Status:</strong> Under review</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendDocumentAdminEmail(data: {
  adminEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  documentId: string;
}) {
  return sendEmail({
    to: data.adminEmail,
    subject: `New document uploaded - ${data.customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:680px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit Admin</h1>
          <h2>New document received</h2>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>
          <p><strong>Document type:</strong> ${data.documentType}</p>
          <p><strong>File name:</strong> ${data.fileName}</p>
          <p><strong>Document ID:</strong> ${data.documentId}</p>
          <p><strong>File URL:</strong> ${data.fileUrl}</p>
        </div>
      </div>
    `,
  });
}

export async function sendDocumentDecisionCustomerEmail(
  email: string,
  fullName: string,
  data: {
    documentType: string;
    fileName: string;
    status: "APPROVED" | "REJECTED" | "PENDING";
    reason?: string | null;
  }
) {
  const title =
    data.status === "APPROVED"
      ? "Document approved"
      : data.status === "REJECTED"
      ? "Document rejected"
      : "More information required";

  const message =
    data.status === "APPROVED"
      ? "Your document has been reviewed and approved."
      : data.status === "REJECTED"
      ? "Your document has been reviewed but could not be approved."
      : "Our team needs additional information before we can approve your document.";

  return sendEmail({
    to: email,
    subject: `${title} - Fluido Credit`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;">
          <h1 style="color:#062B8C;">Fluido Credit</h1>
          <h2>${title}</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>${message}</p>
          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Document type:</strong> ${data.documentType}</p>
            <p><strong>File name:</strong> ${data.fileName}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            ${
              data.reason
                ? `<p><strong>Comment:</strong> ${data.reason}</p>`
                : ""
            }
          </div>
        </div>
      </div>
    `,
  });
}