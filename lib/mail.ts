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

export async function sendLoanStatusCustomerEmail(data: {
  email: string;
  fullName: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "FUNDED" | "REJECTED";
  amount: number;
  loanId: string;
  note?: string | null;
}) {
  const amount = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(data.amount || 0);

  const content =
    data.status === "UNDER_REVIEW"
      ? {
          subject: "Your Fluido Credit loan is under review",
          title: "Loan under review",
          message: `Your loan request of ${amount} is now being reviewed by our financing team.`,
        }
      : data.status === "APPROVED"
      ? {
          subject: "Your Fluido Credit loan has been approved",
          title: "Loan approved",
          message: `Your loan request of ${amount} has been approved.`,
        }
      : data.status === "FUNDED"
      ? {
          subject: "Your Fluido Credit loan has been funded",
          title: "Funds credited",
          message: `Your approved loan of ${amount} has been credited to your Fluido Credit account.`,
        }
      : data.status === "REJECTED"
      ? {
          subject: "Update on your Fluido Credit loan request",
          title: "Loan request not approved",
          message: `Your loan request of ${amount} could not be approved at this time.`,
        }
      : {
          subject: "Your Fluido Credit loan status has been updated",
          title: "Loan status updated",
          message: `Your loan request of ${amount} has been updated.`,
        };

  return sendEmail({
    to: data.email,
    subject: content.subject,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2 style="color:#06183A;margin-top:24px;">${content.title}</h2>

          <p>Hello <strong>${data.fullName}</strong>,</p>
          <p>${content.message}</p>

          ${
            data.note
              ? `<div style="background:#eef5ff;border-radius:18px;padding:18px;margin:24px 0;">
                  <strong>Note from Fluido Credit:</strong>
                  <p style="margin-bottom:0;">${data.note}</p>
                </div>`
              : ""
          }

          <div style="background:#f8fafc;border-radius:18px;padding:18px;margin:24px 0;">
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Application ID:</strong> ${data.loanId}</p>
          </div>

          <p style="font-size:13px;color:#64748b;">
            You can view this update from your secure Fluido Credit dashboard.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendWithdrawalBeneficiaryEmail(data: {
  email: string;
  beneficiaryName: string;
  senderName: string;
  amount: number;
  currency: string;
  reference: string;
}) {
  return sendEmail({
    to: data.email,
    subject: "Incoming Fluido Credit transfer notification",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2>Incoming transfer notification</h2>
          <p>Hello <strong>${data.beneficiaryName}</strong>,</p>
          <p>A withdrawal transfer has been initiated in your favour by <strong>${data.senderName}</strong>.</p>

          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
            <p><strong>Reference:</strong> ${data.reference}</p>
            <p><strong>Status:</strong> Processing</p>
          </div>

          <p>The transfer is being reviewed and processed securely.</p>
        </div>
      </div>
    `,
  });
}

export async function sendTransferCustomerEmail(data: {
  email: string;
  fullName: string;
  beneficiaryName: string;
  beneficiaryIban: string;
  amount: number;
  currency: string;
  reference: string;
}) {
  return sendEmail({
    to: data.email,
    subject: "Your Fluido Credit transfer has been created",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2>Transfer confirmation</h2>
          <p>Hello <strong>${data.fullName}</strong>,</p>
          <p>Your transfer has been created successfully.</p>

          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
            <p><strong>Beneficiary:</strong> ${data.beneficiaryName}</p>
            <p><strong>IBAN:</strong> ${data.beneficiaryIban}</p>
            <p><strong>Reference:</strong> ${data.reference}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendTransferBeneficiaryEmail(data: {
  email: string;
  beneficiaryName: string;
  senderName: string;
  amount: number;
  currency: string;
  reference: string;
}) {
  return sendEmail({
    to: data.email,
    subject: "You received a Fluido Credit transfer",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2>Money received</h2>
          <p>Hello <strong>${data.beneficiaryName}</strong>,</p>
          <p>You have received a transfer from <strong>${data.senderName}</strong>.</p>

          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
            <p><strong>Reference:</strong> ${data.reference}</p>
            <p><strong>Status:</strong> Completed</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendTransferAdminEmail(data: {
  adminEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  beneficiaryName: string;
  beneficiaryIban: string;
  beneficiaryBic?: string | null;
  amount: number;
  currency: string;
  description?: string | null;
  reference: string;
}) {
  return sendEmail({
    to: data.adminEmail,
    subject: `New transfer - ${data.customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:680px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit Admin</h1>
          <h2>New transfer created</h2>

          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

          <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
          <p><strong>Beneficiary:</strong> ${data.beneficiaryName}</p>
          <p><strong>IBAN:</strong> ${data.beneficiaryIban}</p>
          <p><strong>BIC:</strong> ${data.beneficiaryBic || "Not provided"}</p>
          <p><strong>Description:</strong> ${data.description || "Not provided"}</p>
          <p><strong>Reference:</strong> ${data.reference}</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminTransferStatusEmail(data: {
  email: string;
  fullName: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount: number;
  currency: string;
  beneficiaryName?: string | null;
  reference?: string | null;
  note?: string | null;
}) {
  const amount = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: data.currency || "EUR",
  }).format(data.amount || 0);

  const title =
    data.status === "PROCESSING"
      ? "Transfer processing"
      : data.status === "COMPLETED"
      ? "Transfer completed"
      : data.status === "FAILED"
      ? "Transfer failed"
      : "Transfer cancelled";

  return sendEmail({
    to: data.email,
    subject: `Fluido Credit - ${title}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;">
        <div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:32px;border:1px solid #e5e7eb;">
          <h1 style="color:#062B8C;margin:0;">Fluido Credit</h1>
          <h2>${title}</h2>

          <p>Hello <strong>${data.fullName}</strong>,</p>
          <p>Your transfer status has been updated.</p>

          <div style="background:#eef5ff;border-radius:18px;padding:22px;margin:24px 0;">
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Beneficiary:</strong> ${data.beneficiaryName || "Not provided"}</p>
            <p><strong>Reference:</strong> ${data.reference || "Not provided"}</p>
          </div>

          ${
            data.note
              ? `<p><strong>Admin note:</strong> ${data.note}</p>`
              : ""
          }

          <p style="font-size:13px;color:#64748b;">
            You can view this update from your secure Fluido Credit dashboard.
          </p>
        </div>
      </div>
    `,
  });
}