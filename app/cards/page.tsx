import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/AppShell";
import VirtualBankCard from "@/components/cards/VirtualBankCard";
import PhysicalCardRequestForm from "@/components/cards/PhysicalCardRequestForm";

import { getCurrentUser } from "@/lib/auth";
import { getVirtualCard } from "@/lib/card";
import { prisma } from "@/lib/prisma";

function getPhysicalCardStatusLabel(status: string) {
  if (status === "REQUESTED") return "Request received";
  if (status === "IN_PRODUCTION") return "Card in production";
  if (status === "SHIPPING") return "Shipping in progress";
  if (status === "DELIVERED") return "Delivered";
  if (status === "ACTIVE") return "Active";
  if (status === "CANCELLED") return "Cancelled";
  return status;
}

function shortenName(name: string) {
  const clean = name.toUpperCase().trim();
  return clean.length > 22 ? `${clean.slice(0, 22)}...` : clean;
}

export default async function CardsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const card = getVirtualCard(user);

  const physicalCard = await prisma.physicalCardRequest.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AppShell>
      <main className="min-h-screen bg-[#F5F7FB]">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
                Fluido Credit Cards
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
                Cards
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your virtual card and request a physical VIP card.
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

              {physicalCard ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-black text-[#06183A]">
                        Physical VIP Card
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        Delivery usually takes up to 2 weeks.
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-[#062B8C]">
                      {getPhysicalCardStatusLabel(physicalCard.status)}
                    </span>
                  </div>

                  {physicalCard.status === "ACTIVE" ? (
                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06183A] via-[#062B8C] to-[#111827] p-6 text-white shadow-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
                              FLUIDO
                            </p>
                            <p className="text-xl font-black">VIP CARD</p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-black">VISA</p>
                            <p className="text-xs font-bold text-blue-100">
                              Physical
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 h-8 w-12 rounded-lg bg-yellow-300" />

                        <p className="mt-8 text-xl font-black tracking-[0.18em]">
                          {physicalCard.maskedNumber || "•••• •••• •••• ••••"}
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-blue-100">
                              Holder
                            </p>
                            <p className="mt-2 truncate text-xs font-black">
                              {shortenName(user.fullName)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-blue-100">
                              Expiry
                            </p>
                            <p className="mt-2 text-xs font-black">
                              {physicalCard.expiry || "--/--"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-[2rem] bg-[#0B1220] p-6 text-white shadow-xl">
                        <div className="h-10 w-full rounded-lg bg-black/70" />

                        <div className="mt-8 rounded-2xl bg-white/10 p-4">
                          <p className="text-xs text-blue-100">CVV</p>
                          <p className="mt-2 text-lg font-black">
                            {physicalCard.cvv ? "•••" : "---"}
                          </p>
                        </div>

                        <div className="mt-6 rounded-2xl bg-white/10 p-4">
                          <p className="text-xs text-blue-100">Status</p>
                          <p className="mt-2 text-lg font-black">
                            {getPhysicalCardStatusLabel(physicalCard.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[2rem] bg-slate-50 p-6">
                      <p className="text-sm font-black text-[#06183A]">
                        Request status
                      </p>

                      <p className="mt-2 text-2xl font-black text-[#062B8C]">
                        {getPhysicalCardStatusLabel(physicalCard.status)}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold text-slate-400">
                            Country
                          </p>
                          <p className="mt-2 font-black">
                            {physicalCard.country}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold text-slate-400">
                            City
                          </p>
                          <p className="mt-2 font-black">
                            {physicalCard.city}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold text-slate-400">
                            Created
                          </p>
                          <p className="mt-2 font-black">
                            {new Date(
                              physicalCard.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-white p-4 text-sm">
                        <p className="text-xs font-bold text-slate-400">
                          Delivery address
                        </p>
                        <p className="mt-2 font-black text-[#06183A]">
                          {physicalCard.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <PhysicalCardRequestForm />
              )}

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Virtual status", card.status, "bg-emerald-50", "text-emerald-700"],
                  ["Virtual type", card.type, "bg-blue-50", "text-[#062B8C]"],
                  [
                    "Physical card",
                    physicalCard
                      ? getPhysicalCardStatusLabel(physicalCard.status)
                      : "Not requested",
                    "bg-slate-50",
                    "text-[#06183A]",
                  ],
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
                      Current spending limits.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-[#062B8C]">
                    EUR
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    ["Daily spending", "€5,000", "65%"],
                    ["Online payments", "€2,500", "40%"],
                    ["ATM withdrawal", "€1,000", "25%"],
                  ].map(([label, value, width]) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">
                          {label}
                        </span>
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

                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Virtual card</p>
                  <p className="mt-2 text-2xl font-black">{card.status}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Physical card</p>
                  <p className="mt-2 text-2xl font-black">
                    {physicalCard
                      ? getPhysicalCardStatusLabel(physicalCard.status)
                      : "Not requested"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Security Actions
                </h2>

                <div className="mt-5 grid gap-3">
                  {["Freeze Card", "Unfreeze Card", "Change Limits", "Report Card"].map(
                    (action) => (
                      <form key={action} action="/api/cards/update" method="POST">
                        <input type="hidden" name="action" value={action} />
                        <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-black text-[#06183A] transition hover:border-[#062B8C] hover:bg-blue-50">
                          {action}
                        </button>
                      </form>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-lg font-black text-[#06183A]">Important</h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Never share your CVV, card number or banking security details.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}