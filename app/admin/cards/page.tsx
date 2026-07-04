import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";
import VirtualBankCard from "@/components/cards/VirtualBankCard";
import { getVirtualCard } from "@/lib/card";

export default async function AdminCardsPage() {
  await requireAdmin();

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const activeCards = customers.filter((user) => user.emailVerified);
  const pendingCards = customers.filter((user) => !user.emailVerified);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Card Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Virtual Cards
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor customer virtual cards, status, holders and security activity.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <AdminStatCard
            title="Total Cards"
            value={customers.length}
            icon="💳"
            tone="dark"
          />
          <AdminStatCard
            title="Active Cards"
            value={activeCards.length}
            icon="✅"
            tone="green"
          />
          <AdminStatCard
            title="Pending Cards"
            value={pendingCards.length}
            icon="⏳"
            tone="amber"
          />
          <AdminStatCard
            title="Card Brand"
            value="VISA"
            icon="🏦"
            tone="blue"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {customers.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm xl:col-span-2">
              <h2 className="text-xl font-black text-[#06183A]">
                No customer cards yet
              </h2>
              <p className="mt-2 text-slate-500">
                Customer virtual cards will appear here.
              </p>
            </div>
          ) : (
            customers.map((customer) => {
              const card = getVirtualCard(customer);

              return (
                <div
                  key={customer.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
                    <div className="min-w-0">
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
                    </div>

                    <aside className="rounded-3xl bg-slate-50 p-5">
                      <h3 className="font-black text-[#06183A]">
                        Card owner
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <p>
                          <strong>Name:</strong> {customer.fullName}
                        </p>
                        <p className="break-all">
                          <strong>Email:</strong> {customer.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {customer.phone}
                        </p>
                        <p>
                          <strong>Country:</strong> {customer.country}
                        </p>
                        <p>
                          <strong>City:</strong> {customer.city}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {customer.emailVerified ? "Active" : "Pending"}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(customer.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="rounded-2xl bg-[#062B8C] px-4 py-3 text-center text-sm font-black text-white"
                        >
                          View customer
                        </Link>

                        <Link
                          href="/admin/transactions"
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black"
                        >
                          View transactions
                        </Link>
                      </div>
                    </aside>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}