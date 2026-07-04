import Link from "next/link";
import AppShell from "@/components/app/AppShell";

export default function PrivacyPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-10">
          <p className="text-sm font-black text-blue-200">Fluido Credit</p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
            This Privacy Policy explains how Fluido Credit collects, uses,
            protects and manages personal data when customers use our online
            banking and loan services.
          </p>

          <p className="mt-4 text-sm font-bold text-blue-200">
            Last updated: July 2026
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-[#06183A]">Contents</h2>

            <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
              <p>1. Data we collect</p>
              <p>2. How we use data</p>
              <p>3. KYC verification</p>
              <p>4. Loan processing</p>
              <p>5. Security</p>
              <p>6. Data sharing</p>
              <p>7. Customer rights</p>
              <p>8. Contact</p>
            </div>
          </aside>

          <div className="space-y-6">
            {[
              {
                title: "1. Information we collect",
                text: "We may collect your full name, email address, phone number, country, city, address, postal code, identity documents, proof of income, bank statements, loan applications, transactions, device information and login activity.",
              },
              {
                title: "2. How we use your information",
                text: "Your information is used to create and manage your account, verify your identity, process loan requests, manage repayments, prevent fraud, comply with legal obligations, improve our services and communicate important account updates.",
              },
              {
                title: "3. Identity verification and KYC",
                text: "As an online financial platform, Fluido Credit may request identity documents, selfies, proof of address, proof of income and bank statements. These documents are used only for verification, compliance, fraud prevention and loan review.",
              },
              {
                title: "4. Loan application processing",
                text: "When you apply for a loan, we process financial information such as requested amount, loan duration, repayment capacity, documents, account activity and risk assessment data to review your eligibility.",
              },
              {
                title: "5. Data security",
                text: "We use technical and organizational security measures to protect your personal data. Passwords are stored securely using hashing, sensitive documents are stored in protected storage, and administrator actions are logged for audit purposes.",
              },
              {
                title: "6. Sharing of information",
                text: "We do not sell your personal data. We may share limited information with payment providers, compliance partners, verification services, banking partners, legal authorities or technical providers when required to provide our services or comply with regulations.",
              },
              {
                title: "7. Data retention",
                text: "We keep personal data only as long as necessary for account management, financial services, legal compliance, fraud prevention and audit obligations. Some financial and verification records may be retained after account closure when required by law.",
              },
              {
                title: "8. Your rights",
                text: "You may request access, correction, deletion, restriction or portability of your personal data, subject to legal and regulatory obligations. Some data cannot be deleted immediately if it is required for financial compliance or fraud prevention.",
              },
              {
                title: "9. Cookies and analytics",
                text: "Fluido Credit may use cookies and technical tools to secure sessions, remember preferences, improve performance, detect suspicious activity and analyze service usage.",
              },
              {
                title: "10. Contact",
                text: "For privacy questions or data protection requests, contact Fluido Credit support at support@fluidocredit.com.",
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
              >
                <h2 className="text-xl font-black text-[#06183A] md:text-2xl">
                  {section.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                  {section.text}
                </p>
              </div>
            ))}

            <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 md:p-8">
              <h2 className="text-xl font-black text-[#06183A]">
                Important notice
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                This page is a professional privacy policy template. Before
                launching Fluido Credit publicly, it should be reviewed by a
                qualified legal professional to ensure compliance with applicable
                banking, data protection and consumer credit laws.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-2xl bg-[#062B8C] px-6 py-4 text-center text-sm font-black text-white"
              >
                Back to home
              </Link>

              <Link
                href="/contact"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-sm font-black text-[#06183A]"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}