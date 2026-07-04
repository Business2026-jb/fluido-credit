import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import VirtualBankCard from "@/components/cards/VirtualBankCard";
import { getCurrentUser } from "@/lib/auth";
import { getVirtualCard } from "@/lib/card";

export default async function CardsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const card = getVirtualCard(user);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Fluido Credit Card Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Bank Cards
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your virtual card, spending limits and security controls from one secure space.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <VirtualBankCard
              holder={card.holder}
              number={card.number}
              maskedNumber={card.maskedNumber}
              expiry={card.expiry}
              cvv={card.cvv}
              maskedCvv={card.maskedCvv}
              brand={card.brand}
              type={card.type}
              status={card.status}
            />

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Card status", card.status, "bg-emerald-50", "text-emerald-700"],
                ["Card type", card.type, "bg-blue-50", "text-[#062B8C]"],
                ["Card brand", card.brand, "bg-slate-50", "text-[#06183A]"],
              ].map(([title, value, bg, color]) => (
                <div
                  key={title}
                  className={`rounded-[2rem] border border-slate-200 ${bg} p-6 shadow-sm`}
                >
                  <p className="text-sm font-bold text-slate-500">{title}</p>
                  <p className={`mt-3 text-2xl font-black ${color}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#06183A]">
                    Card Limits
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Your current security and spending limits.
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-[#062B8C]">
                  EUR
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {[
                  ["Daily spending limit", "€5,000", "65%"],
                  ["Online payments limit", "€2,500", "40%"],
                  ["ATM withdrawal limit", "€1,000", "25%"],
                ].map(([label, value, width]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-500">{label}</span>
                      <strong className="text-[#06183A]">{value}</strong>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#062B8C]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Card Security</h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Your card is protected with secure banking controls. Use sensitive actions only when necessary.
              </p>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-blue-100">Secure status</p>
                <p className="mt-2 text-2xl font-black">{card.status}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Security Actions
              </h2>

              <div className="mt-5 grid gap-3">
                {[
                  "Freeze Card",
                  "Unfreeze Card",
                  "Regenerate CVV",
                  "Change Limits",
                  "Report Card",
                  "Request New Card",
                ].map((action) => (
                  <form key={action} action="/api/cards/update" method="POST">
                    <input type="hidden" name="action" value={action} />
                    <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-black text-[#06183A] transition hover:border-[#062B8C] hover:bg-blue-50">
                      {action}
                    </button>
                  </form>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-black text-[#06183A]">
                Important
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Never share your CVV, card number or security details. Fluido Credit will never ask for your full card details by message or phone.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}