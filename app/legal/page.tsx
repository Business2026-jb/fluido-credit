import Link from "next/link";
import AppShell from "@/components/app/AppShell";

export default function LegalNoticePage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-10">
          <p className="text-sm font-black text-blue-200">Fluido Credit</p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Legal Notice
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
            This Legal Notice provides official information about Fluido Credit,
            its online lending services, legal identity, customer obligations,
            compliance framework and contact details.
          </p>

          <p className="mt-4 text-sm font-bold text-blue-200">
            Last updated: July 2026
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-[#06183A]">Contents</h2>

            <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
              <p>1. Company information</p>
              <p>2. Legal registration</p>
              <p>3. Services</p>
              <p>4. Compliance</p>
              <p>5. KYC and AML</p>
              <p>6. Liability</p>
              <p>7. Intellectual property</p>
              <p>8. Contact</p>
            </div>
          </aside>

          <div className="space-y-6">
            {[
              {
                title: "1. Company Information",
                text: "Fluido Credit is a Société Anonyme providing online financial technology services focused on digital credit, customer accounts, loan application management, document verification and secure customer operations.",
              },
              {
                title: "2. Legal Identity",
                text: "Company name: Fluido Credit. Legal form: Société Anonyme. SIREN: 234 678 990. RCS: RCS Paris 424 678 983. Registered office: Avenue du 15e Corps, 06000 Nice, France.",
              },
              {
                title: "3. Contact Details",
                text: "For customer support, legal requests or administrative correspondence, Fluido Credit can be contacted by email at support@fluidocredit.com or by telephone at +33 7 57 75 04 73.",
              },
              {
                title: "4. Online Banking and Lending Services",
                text: "Fluido Credit provides digital services related to online loan applications, account management, customer verification, document submission, payment tracking, transfers, withdrawals and customer support.",
              },
              {
                title: "5. Know Your Customer Verification",
                text: "Customers may be required to provide identity documents, proof of address, proof of income, selfies, bank statements or other supporting documents for identity verification, loan review and compliance purposes.",
              },
              {
                title: "6. Anti-Money Laundering and Fraud Prevention",
                text: "Fluido Credit may apply controls designed to prevent fraud, identity theft, money laundering, terrorist financing, unauthorized access and misuse of financial services.",
              },
              {
                title: "7. Customer Responsibility",
                text: "Customers are responsible for providing accurate, complete and up-to-date information. False information, forged documents or fraudulent use of the platform may lead to account suspension or legal action.",
              },
              {
                title: "8. Intellectual Property",
                text: "All trademarks, logos, interface designs, texts, software elements, databases and digital content displayed on Fluido Credit are protected and may not be copied, reproduced or used without authorization.",
              },
              {
                title: "9. Website Availability",
                text: "Fluido Credit aims to provide reliable access to its services. However, access may be interrupted due to maintenance, technical issues, security updates, third-party provider outages or regulatory requirements.",
              },
              {
                title: "10. Limitation of Liability",
                text: "Fluido Credit shall not be responsible for losses caused by incorrect customer information, unauthorized account access, misuse of credentials, third-party service interruptions or circumstances beyond its reasonable control.",
              },
              {
                title: "11. Governing Law",
                text: "This Legal Notice is governed by French law. Any dispute relating to the use of Fluido Credit services may be subject to the competent courts and applicable regulatory procedures.",
              },
              {
                title: "12. Complaints",
                text: "Customers may submit complaints or legal requests by contacting Fluido Credit support at support@fluidocredit.com. Complaints will be reviewed according to internal procedures and applicable law.",
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
                Important Notice
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                This Legal Notice is a professional template based on the
                information provided. Before public launch, Fluido Credit should
                have this page reviewed by a qualified legal professional to
                ensure compliance with banking, lending, consumer credit and data
                protection regulations.
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
                href="/terms"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-sm font-black text-[#06183A]"
              >
                Terms and Conditions
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