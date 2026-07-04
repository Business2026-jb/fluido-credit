import Link from "next/link";
import AppShell from "@/components/app/AppShell";

export default function TermsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-10">
          <p className="text-sm font-black text-blue-200">Fluido Credit</p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Terms and Conditions
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
            These Terms and Conditions govern the use of Fluido Credit’s online
            banking, loan, account, card, transfer and verification services.
          </p>

          <p className="mt-4 text-sm font-bold text-blue-200">
            Last updated: July 2026
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-[#06183A]">Contents</h2>

            <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
              <p>1. Acceptance</p>
              <p>2. Eligibility</p>
              <p>3. Account security</p>
              <p>4. Loan services</p>
              <p>5. Documents and KYC</p>
              <p>6. Payments and transfers</p>
              <p>7. Cards</p>
              <p>8. Prohibited use</p>
              <p>9. Liability</p>
              <p>10. Termination</p>
            </div>
          </aside>

          <div className="space-y-6">
            {[
              {
                title: "1. Acceptance of Terms",
                text: "By creating an account or using Fluido Credit services, you agree to these Terms and Conditions. If you do not agree, you must not use the platform.",
              },
              {
                title: "2. Eligibility",
                text: "You must provide accurate personal information and meet the eligibility requirements applicable to your country, identity, age, financial situation and legal capacity.",
              },
              {
                title: "3. Account Registration and Security",
                text: "You are responsible for keeping your login credentials secure. Fluido Credit may suspend access if suspicious activity, fraud risk or unauthorized use is detected.",
              },
              {
                title: "4. Online Loan Services",
                text: "Loan applications submitted through Fluido Credit are reviewed based on information provided by the customer, verification documents, repayment capacity, risk assessment and internal policies.",
              },
              {
                title: "5. Identity Verification and KYC",
                text: "Fluido Credit may require identity documents, selfies, proof of address, proof of income, bank statements and other documents to verify your identity and comply with KYC and AML requirements.",
              },
              {
                title: "6. Payments, Withdrawals and Transfers",
                text: "Customers may request transfers, withdrawals and payments depending on account status, available balance, verification status and operational controls. Some transactions may require manual review.",
              },
              {
                title: "7. Cards and Digital Banking Features",
                text: "Virtual or physical card features may be subject to eligibility, verification, spending limits, fraud monitoring and security controls. Fluido Credit may block or restrict card usage when necessary.",
              },
              {
                title: "8. Fees, Rates and Charges",
                text: "Applicable fees, interest rates, repayment amounts and service charges may depend on the selected product, loan terms, country, risk profile and platform settings.",
              },
              {
                title: "9. Customer Obligations",
                text: "You agree to provide truthful information, keep your documents updated, repay loans on time, avoid fraudulent activity and comply with all applicable laws and platform rules.",
              },
              {
                title: "10. Prohibited Activities",
                text: "You must not use Fluido Credit for fraud, money laundering, identity theft, unauthorized access, illegal transactions, abuse of credit products or any activity that violates applicable law.",
              },
              {
                title: "11. Service Availability",
                text: "Fluido Credit aims to provide reliable digital services, but access may be interrupted due to maintenance, technical issues, security checks, provider outages or regulatory requirements.",
              },
              {
                title: "12. Limitation of Liability",
                text: "Fluido Credit is not liable for losses caused by incorrect information provided by the customer, unauthorized access due to poor password security, third-party outages or misuse of services.",
              },
              {
                title: "13. Account Suspension or Termination",
                text: "We may suspend, restrict or close an account if required for security, compliance, fraud prevention, unpaid obligations, suspicious activity or violation of these Terms.",
              },
              {
                title: "14. Changes to These Terms",
                text: "Fluido Credit may update these Terms from time to time. Continued use of the platform after updates means you accept the revised Terms.",
              },
              {
                title: "15. Contact",
                text: "For questions about these Terms and Conditions, contact Fluido Credit support at support@fluidocredit.com.",
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

            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 md:p-8">
              <h2 className="text-xl font-black text-[#06183A]">
                Important legal notice
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                This page is a professional Terms and Conditions template for an
                online banking and lending platform. Before launching publicly,
                it should be reviewed by a qualified legal professional to
                ensure compliance with banking, consumer credit, data protection
                and financial regulations.
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
                href="/privacy"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-sm font-black text-[#06183A]"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}