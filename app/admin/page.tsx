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

export default async function AdminDashboardPage() {
  await requireAdmin();

  const usersCount = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const accountsCount = await prisma.account.count();
  const documentsPending = await prisma.document.count({ where: { status: "PENDING" } });
  const loansPending = await prisma.loanApplication.count({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
  });
  const withdrawalsPending = await prisma.transaction.count({
    where: { type: "WITHDRAWAL", status: "PROCESSING" },
  });
  const transfersPending = await prisma.transaction.count({
    where: { type: "TRANSFER", status: "PROCESSING" },
  });

  const balances = await prisma.account.aggregate({
    _sum: {
      balance: true,
      availableBalance: true,
      blockedBalance: true,
    },
  });

  const loanTotals = await prisma.loanApplication.aggregate({
    _sum: {
      amount: true,
      monthlyPayment: true,
    },
  });

  const transactionTotals = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });

  const recentCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentDocuments = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 5,
  });

  const recentLoans = await prisma.loanApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 5,
  });

  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      status: "PROCESSING",
    },
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 6,
  });

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Fluido Credit Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Banking Control Center
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Real-time overview of customers, accounts, loans, documents, withdrawals, transfers and transactions.
            </p>
          </div>

          <Link
            href="/admin/settings"
            className="rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20"
          >
            Platform Settings
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
          <AdminStatCard title="Customers" value={usersCount} icon="👥" tone="dark" />
          <AdminStatCard title="Accounts" value={accountsCount} icon="🏦" tone="blue" />
          <AdminStatCard title="Documents" value={documentsPending} icon="📄" tone="amber" />
          <AdminStatCard title="Loans" value={loansPending} icon="💶" tone="green" />
          <AdminStatCard title="Withdrawals" value={withdrawalsPending} icon="🏧" tone="red" />
          <AdminStatCard title="Transfers" value={transfersPending} icon="🔁" tone="blue" />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-4">
          <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-blue-100">Total customer balance</p>
            <p className="mt-3 text-4xl font-black">
              {formatMoney(balances._sum.balance || 0)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Available balance</p>
            <p className="mt-3 text-3xl font-black text-emerald-600">
              {formatMoney(balances._sum.availableBalance || 0)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Blocked balance</p>
            <p className="mt-3 text-3xl font-black text-red-500">
              {formatMoney(balances._sum.blockedBalance || 0)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Transaction volume</p>
            <p className="mt-3 text-3xl font-black text-[#06183A]">
              {formatMoney(transactionTotals._sum.amount || 0)}
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#06183A]">Quick Actions</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ["Customers", "/admin/customers", "👥"],
                ["Accounts", "/admin/accounts", "🏦"],
                ["Cards", "/admin/cards", "💳"],
                ["Cards Physical", "/admin/cards/physical", "💳"],
                ["Documents", "/admin/documents", "📄"],
                ["Loans", "/admin/loans", "💶"],
                ["Deposits", "/admin/deposits", "💶"],
                ["Withdrawals", "/admin/withdrawals", "🏧"],
                ["Transfers", "/admin/transfers", "🔁"],
                ["Transactions", "/admin/transactions", "📊"],
                ["Notifications", "/admin/notifications", "🔔"],
              ].map(([label, href, icon]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-2xl border border-slate-200 p-4 text-center font-black hover:border-blue-600 hover:bg-blue-50"
                >
                  <div className="text-2xl">{icon}</div>
                  <div className="mt-2 text-sm">{label}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#062B8C] p-6 text-white shadow-xl">
            <h2 className="text-xl font-black">Loan Portfolio</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-blue-100">Total requested</p>
                <p className="mt-2 text-2xl font-black">
                  {formatMoney(loanTotals._sum.amount || 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-blue-100">Monthly payments</p>
                <p className="mt-2 text-2xl font-black">
                  {formatMoney(loanTotals._sum.monthlyPayment || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">Recent Loan Applications</h2>
              <div className="mt-5 space-y-3">
                {recentLoans.length === 0 ? (
                  <p className="text-sm text-slate-500">No loan applications yet.</p>
                ) : (
                  recentLoans.map((loan) => (
                    <div key={loan.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-black">{loan.purpose || "Loan application"}</p>
                          <p className="text-sm text-slate-500">
                            {loan.user.fullName} · {loan.user.email}
                          </p>
                        </div>
                        <p className="font-black text-[#06183A]">
                          {formatMoney(loan.amount)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        Status: {loan.status} · {new Date(loan.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">Pending Operations</h2>
              <div className="mt-5 space-y-3">
                {pendingTransactions.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending operations.</p>
                ) : (
                  pendingTransactions.map((tx) => (
                    <div key={tx.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-black">{tx.title}</p>
                          <p className="text-sm text-slate-500">
                            {tx.user.fullName} · {tx.type}
                          </p>
                        </div>
                        <p className="font-black text-red-500">
                          {formatMoney(tx.amount, tx.currency)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        {tx.reference || "No reference"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">Recent Documents</h2>
              <div className="mt-5 space-y-3">
                {recentDocuments.length === 0 ? (
                  <p className="text-sm text-slate-500">No documents yet.</p>
                ) : (
                  recentDocuments.map((doc) => (
                    <div key={doc.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-black">{doc.type}</p>
                      <p className="text-sm text-slate-500">
                        {doc.user.fullName}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {doc.status} · {new Date(doc.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">Recent Customers</h2>
              <div className="mt-5 space-y-3">
                {recentCustomers.length === 0 ? (
                  <p className="text-sm text-slate-500">No customers yet.</p>
                ) : (
                  recentCustomers.map((customer) => (
                    <Link
                      key={customer.id}
                      href={`/admin/customers/${customer.id}`}
                      className="block rounded-2xl bg-slate-50 p-4 hover:bg-blue-50"
                    >
                      <p className="font-black">{customer.fullName}</p>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {new Date(customer.createdAt).toLocaleString()}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}