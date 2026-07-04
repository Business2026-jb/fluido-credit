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

export default async function AdminTransactionsPage() {
  await requireAdmin();

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      account: true,
    },
    take: 150,
  });

  const incoming = transactions.filter((tx) => tx.direction === "IN");
  const outgoing = transactions.filter((tx) => tx.direction === "OUT");
  const completed = transactions.filter((tx) => tx.status === "COMPLETED");
  const processing = transactions.filter((tx) => tx.status === "PROCESSING");

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncoming = incoming.reduce((sum, tx) => sum + tx.amount, 0);
  const totalOutgoing = outgoing.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Transaction Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor all transfers, withdrawals, deposits, loan operations and card activity.
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
          <AdminStatCard title="Total Transactions" value={transactions.length} icon="📊" tone="dark" />
          <AdminStatCard title="Completed" value={completed.length} icon="✅" tone="green" />
          <AdminStatCard title="Processing" value={processing.length} icon="⏳" tone="amber" />
          <AdminStatCard title="Incoming" value={incoming.length} icon="⬇️" tone="blue" />
          <AdminStatCard title="Outgoing" value={outgoing.length} icon="⬆️" tone="red" />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-blue-100">Total volume</p>
            <p className="mt-3 text-4xl font-black">{formatMoney(totalVolume)}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Incoming volume</p>
            <p className="mt-3 text-4xl font-black text-emerald-600">
              {formatMoney(totalIncoming)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Outgoing volume</p>
            <p className="mt-3 text-4xl font-black text-red-500">
              {formatMoney(totalOutgoing)}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#06183A]">
                Transaction ledger
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete real-time transaction history across the platform.
              </p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="rounded-3xl bg-blue-50 p-8 text-center">
              <h3 className="text-xl font-black text-[#06183A]">
                No transactions yet
              </h3>
              <p className="mt-3 text-slate-500">
                Customer operations will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-xs font-black uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-2">Transaction</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Direction</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Reference</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="bg-slate-50">
                      <td className="rounded-l-2xl px-4 py-4">
                        <p className="font-black text-[#06183A]">{tx.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {tx.description || "No description"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-[#06183A]">
                          {tx.user.fullName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {tx.user.email}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          {tx.type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            tx.direction === "IN"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.direction}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p
                          className={`text-lg font-black ${
                            tx.direction === "IN"
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {tx.direction === "IN" ? "+" : "-"}
                          {formatMoney(tx.amount, tx.currency)}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
                          {tx.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p className="max-w-[180px] break-all text-xs font-bold text-slate-500">
                          {tx.reference || "No reference"}
                        </p>
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        <p className="text-xs font-bold text-slate-500">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}