import Link from "next/link";
import AppShell from "@/components/app/AppShell";

export default function SupportPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-widest text-blue-100">
              Fluido Credit Support
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              Secure customer assistance
            </h1>

            <p className="mt-4 text-sm leading-7 text-blue-100 md:text-base">
              Get support for account access, verification, loans, withdrawals,
              transfers, cards and security alerts.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              ["Response", "24 business hours"],
              ["Security", "Verified support only"],
              ["Access", "Europe customer desk"],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">{title}</p>
                <p className="mt-2 font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: "🇫🇷",
              title: "France Desk",
              text: "Customer support for France and French-speaking clients.",
              value: "+33 7 57 75 04 73",
              href: "https://wa.me/33757750473",
              color: "text-emerald-600",
            },
            {
              icon: "🇩🇪",
              title: "Germany Desk",
              text: "Customer support for Germany and European clients.",
              value: "+49 177 1350350",
              href: "https://wa.me/491771350350",
              color: "text-emerald-600",
            },
            {
              icon: "✉️",
              title: "Email Support",
              text: "Send a detailed request to our support team.",
              value: "contact@fluidocredit.com",
              href: "mailto:contact@fluidocredit.com",
              color: "text-[#062B8C]",
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#062B8C] hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
                {item.icon}
              </div>

              <h2 className="mt-5 text-xl font-black text-[#06183A]">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.text}
              </p>

              <p className={`mt-5 break-all text-lg font-black ${item.color}`}>
                {item.value}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#06183A]">
              What can we help with?
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Account access",
                "Identity verification",
                "Loan application",
                "Withdrawals",
                "Bank transfers",
                "Virtual card",
                "Security alert",
                "Profile update",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-black text-[#06183A]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-[#062B8C] p-6 text-white shadow-xl">
            <h2 className="text-xl font-black">Security notice</h2>

            <p className="mt-4 text-sm leading-6 text-blue-100">
              Fluido Credit will never ask for your password, verification code,
              card CVV or private banking details by WhatsApp or email.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 block rounded-2xl bg-white py-4 text-center text-sm font-black text-[#062B8C]"
            >
              Back to dashboard
            </Link>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}