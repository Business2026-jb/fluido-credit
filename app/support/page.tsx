import Link from "next/link";
import AppShell from "@/components/app/AppShell";

const APP_URL = "https://fluidocredit.com";

const supportContacts = [
  {
    flag: "🇮🇹",
    title: "Italy Support",
    phone: "+39 380 364 8763",
    callHref: "tel:+393803648763",
    whatsappHref: "https://wa.me/393803648763",
  },
  {
    flag: "🇫🇷",
    title: "France Support",
    phone: "+33 6 05 77 90 19",
    callHref: "tel:+33605779019",
    whatsappHref: "https://wa.me/33605779019",
  },
  {
    flag: "🇬🇧",
    title: "UK Support",
    phone: "+44 7520 653956",
    callHref: "tel:+447520653956",
    whatsappHref: "https://wa.me/447520653956",
  },
  {
    flag: "🇩🇪",
    title: "Germany Support",
    phone: "+49 1521 7282264",
    callHref: "tel:+4915217282264",
    whatsappHref: "https://wa.me/4915217282264",
  },
];

export default function SupportPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-[#F5F7FB]">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-6 rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-100">
                  Fluido Credit Support
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  Contact support
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                  Call or WhatsApp our support team for account, payment, card
                  and verification assistance.
                </p>
              </div>

              <Link
                href={`${APP_URL}/dashboard`}
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-[#062B8C]"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {supportContacts.map((contact) => (
              <div
                key={contact.phone}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
                  {contact.flag}
                </div>

                <h2 className="mt-5 text-xl font-black text-[#06183A]">
                  {contact.title}
                </h2>

                <p className="mt-3 break-all text-lg font-black text-[#062B8C]">
                  {contact.phone}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={contact.callHref}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-[#06183A]"
                  >
                    Call
                  </a>

                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-black text-white"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Support topics
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  "Account access",
                  "Identity verification",
                  "Deposit",
                  "Withdrawal",
                  "Transfer",
                  "Card",
                  "Loan",
                  "Security alert",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-[#06183A]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] bg-[#062B8C] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Security notice</h2>

              <p className="mt-4 text-sm leading-6 text-blue-100">
                Fluido Credit will never ask for your password, verification
                code, card CVV or private banking details by WhatsApp or email.
              </p>

              <a
                href="mailto:contact@fluidocredit.com"
                className="mt-6 block rounded-2xl bg-white py-4 text-center text-sm font-black text-[#062B8C]"
              >
                contact@fluidocredit.com
              </a>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}