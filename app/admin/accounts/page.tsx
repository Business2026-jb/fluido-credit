import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function AdminAccountsPage() {
  await requireAdmin();

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      transactions: true,
    },
    take: 100,
  });

  const activeAccounts = accounts.filter((account) => account.isActive);
  const inactiveAccounts = accounts.filter((account) => !account.isActive);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailable = accounts.reduce(
    (sum, account) => sum + account.availableBalance,
    0
  );
  const totalBlocked = accounts.reduce(
    (sum, account) => sum + account.blockedBalance,
    0
  );

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Account Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Bank Accounts
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor customer accounts, balances, IBANs, BICs and transaction activity.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <AdminStatCard title="Total Accounts" value={accounts.length} icon="🏦" tone="dark" />
          <AdminStatCard title="Active" value={activeAccounts.length} icon="✅" tone="green" />
          <AdminStatCard title="Inactive" value={inactiveAccounts.length} icon="⏳" tone="amber" />
          <AdminStatCard title="Available" value={formatMoney(totalAvailable)} icon="💰" tone="blue" />
          <AdminStatCard title="Blocked" value={formatMoney(totalBlocked)} icon="🔒" tone="red" />
        </div>

        <div className="mb-6 rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
          <p className="text-sm font-bold text-blue-100">
            Total balance across all customer accounts
          </p>
          <p className="mt-3 text-4xl font-black">
            {formatMoney(totalBalance)}
          </p>
        </div>

        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No accounts yet
              </h2>
              <p className="mt-2 text-slate-500">
                Customer bank accounts will appear here.
              </p>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-[#06183A]">
                        {account.name}
                      </h2>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                        {account.type}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          account.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {account.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Balance</p>
                        <p className="mt-2 text-2xl font-black">
                          {formatMoney(account.balance, account.currency)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Available
                        </p>
                        <p className="mt-2 text-2xl font-black text-emerald-600">
                          {formatMoney(account.availableBalance, account.currency)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Blocked</p>
                        <p className="mt-2 text-2xl font-black text-red-500">
                          {formatMoney(account.blockedBalance, account.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p><strong>Customer:</strong> {account.user.fullName}</p>
                      <p><strong>Email:</strong> {account.user.email}</p>
                      <p><strong>Phone:</strong> {account.user.phone}</p>
                      <p><strong>Currency:</strong> {account.currency}</p>
                      <p className="md:col-span-2">
                        <strong>IBAN:</strong>{" "}
                        <span className="break-all">{account.iban || "Not available"}</span>
                      </p>
                      <p><strong>BIC:</strong> {account.bic || "Not available"}</p>
                      <p><strong>Transactions:</strong> {account.transactions.length}</p>
                      <p><strong>Created:</strong> {new Date(account.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-black text-[#06183A]">
                      Account actions
                    </h3>

                    <div className="mt-4 grid gap-3">
                      <Link
                        href="/admin/transactions"
                        className="rounded-2xl bg-[#062B8C] px-4 py-3 text-center text-sm font-black text-white"
                      >
                        View transactions
                      </Link>

                      <Link
                        href="/admin/customers"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black"
                      >
                        View customer
                      </Link>

                      <div className="rounded-2xl bg-white p-4 text-sm text-slate-500">
                        Freeze, close and balance adjustment actions will be added in the next step.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}