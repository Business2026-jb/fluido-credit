import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function TransactionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [account, transactions] = await Promise.all([
    prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "MAIN",
      },
    }),

    prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    }),
  ]);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Account activity
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#06183A] md:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              View all account movements, incoming funds, withdrawals, transfers and loan-related operations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black"
            >
              Dashboard
            </Link>

            <Link
              href="/withdraw"
              className="rounded-2xl bg-[#062B8C] px-5 py-3 text-center text-sm font-black text-white"
            >
              Withdraw
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl shadow-blue-900/10">
              <p className="text-sm font-bold text-blue-100">
                Available balance
              </p>

              <h2 className="mt-5 text-4xl font-black">
                {formatMoney(account?.availableBalance || 0, account?.currency || "EUR")}
              </h2>

              <p className="mt-3 text-sm font-black text-emerald-300">
                Main account · {account?.currency || "EUR"}
              </p>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">IBAN</p>
                <p className="mt-1 break-all text-xs font-black">
                  {account?.iban || "Not available"}
                </p>

                <p className="mt-4 text-xs font-bold text-blue-100">BIC</p>
                <p className="mt-1 text-sm font-black">
                  {account?.bic || "Not available"}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Total transactions
                  </span>
                  <strong>{transactions.length}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Incoming
                  </span>
                  <strong className="text-emerald-600">
                    {
                      transactions.filter((tx) => tx.direction === "IN")
                        .length
                    }
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Outgoing
                  </span>
                  <strong className="text-red-500">
                    {
                      transactions.filter((tx) => tx.direction === "OUT")
                        .length
                    }
                  </strong>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black text-[#06183A]">
                  Recent transactions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  All real transactions linked to your Fluido Credit account.
                </p>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="rounded-3xl bg-blue-50 p-8 text-center">
                <h3 className="text-xl font-black text-[#06183A]">
                  No transaction yet
                </h3>

                <p className="mt-3 text-slate-500">
                  Your deposits, withdrawals and repayments will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full font-black ${
                            tx.direction === "IN"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.direction === "IN" ? "↓" : "↑"}
                        </div>

                        <div>
                          <p className="font-black text-[#06183A]">
                            {tx.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {tx.description || tx.type}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
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

                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {tx.reference || "No reference"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}