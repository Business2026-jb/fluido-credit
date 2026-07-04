import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";
import VirtualBankCard from "@/components/cards/VirtualBankCard";
import { getVirtualCard } from "@/lib/card";
import LoanStatusBadge from "@/components/loan/LoanStatusBadge";
import DocumentStatusBadge from "@/components/admin/DocumentStatusBadge";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function AdminCustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        include: {
          transactions: true,
        },
      },
      loanApplications: {
        orderBy: { createdAt: "desc" },
        include: {
          documents: true,
          payments: true,
          statusHistory: true,
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const card = getVirtualCard(customer);

  const totalBalance = customer.accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const totalLoans = customer.loanApplications.reduce(
    (sum, loan) => sum + loan.amount,
    0
  );

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Customer Profile
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              {customer.fullName}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete customer file with accounts, card, loans, documents,
              transactions and security activity.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Back to Customers
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <AdminStatCard
            title="Total Balance"
            value={formatMoney(totalBalance)}
            icon="💰"
            tone="dark"
          />
          <AdminStatCard
            title="Accounts"
            value={customer.accounts.length}
            icon="🏦"
            tone="blue"
          />
          <AdminStatCard
            title="Loans"
            value={customer.loanApplications.length}
            icon="💶"
            tone="amber"
          />
          <AdminStatCard
            title="Documents"
            value={customer.documents.length}
            icon="📄"
            tone="green"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <p>
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
                  <strong>Address:</strong> {customer.address}
                </p>
                <p>
                  <strong>Postal code:</strong> {customer.postalCode}
                </p>
                <p>
                  <strong>Email verified:</strong>{" "}
                  {customer.emailVerified ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {customer.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Registered:</strong>{" "}
                  {new Date(customer.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Last login:</strong>{" "}
                  {customer.lastLoginAt
                    ? new Date(customer.lastLoginAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Bank Accounts
              </h2>

              <div className="mt-5 space-y-4">
                {customer.accounts.length === 0 ? (
                  <p className="text-sm text-slate-500">No account found.</p>
                ) : (
                  customer.accounts.map((account) => (
                    <div key={account.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-black">{account.name}</h3>
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

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                        <p>
                          <strong>Balance:</strong>{" "}
                          {formatMoney(account.balance, account.currency)}
                        </p>
                        <p>
                          <strong>Available:</strong>{" "}
                          {formatMoney(
                            account.availableBalance,
                            account.currency
                          )}
                        </p>
                        <p>
                          <strong>Blocked:</strong>{" "}
                          {formatMoney(account.blockedBalance, account.currency)}
                        </p>
                        <p className="md:col-span-2">
                          <strong>IBAN:</strong>{" "}
                          <span className="break-all">
                            {account.iban || "Not available"}
                          </span>
                        </p>
                        <p>
                          <strong>BIC:</strong>{" "}
                          {account.bic || "Not available"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Loan Applications
              </h2>

              <div className="mt-5 space-y-4">
                {customer.loanApplications.length === 0 ? (
                  <p className="text-sm text-slate-500">No loan application.</p>
                ) : (
                  customer.loanApplications.map((loan) => (
                    <div key={loan.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-black">
                          {loan.purpose || "Loan application"}
                        </h3>
                        <LoanStatusBadge status={loan.status} />
                      </div>

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                        <p>
                          <strong>Amount:</strong> {formatMoney(loan.amount)}
                        </p>
                        <p>
                          <strong>Monthly:</strong>{" "}
                          {formatMoney(loan.monthlyPayment)}
                        </p>
                        <p>
                          <strong>Rate:</strong> {loan.annualRate}%
                        </p>
                        <p>
                          <strong>Term:</strong> {loan.durationMonths} months
                        </p>
                        <p>
                          <strong>Documents:</strong> {loan.documents.length}
                        </p>
                        <p>
                          <strong>Payments:</strong> {loan.payments.length}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Documents
              </h2>

              <div className="mt-5 space-y-3">
                {customer.documents.length === 0 ? (
                  <p className="text-sm text-slate-500">No document uploaded.</p>
                ) : (
                  customer.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="font-black">{doc.type}</p>
                        <p className="text-sm text-slate-500">{doc.fileName}</p>
                      </div>

                      <DocumentStatusBadge status={doc.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Recent Transactions
              </h2>

              <div className="mt-5 space-y-3">
                {customer.transactions.length === 0 ? (
                  <p className="text-sm text-slate-500">No transaction yet.</p>
                ) : (
                  customer.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="font-black">{tx.title}</p>
                        <p className="text-sm text-slate-500">
                          {tx.type} · {tx.status}
                        </p>
                      </div>

                      <p
                        className={`font-black ${
                          tx.direction === "IN"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {tx.direction === "IN" ? "+" : "-"}
                        {formatMoney(tx.amount, tx.currency)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
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

            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Financial Summary</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-blue-100">Total balance</p>
                  <p className="text-2xl font-black">
                    {formatMoney(totalBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-100">Total loans requested</p>
                  <p className="text-2xl font-black">{formatMoney(totalLoans)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Security Sessions
              </h2>

              <div className="mt-5 space-y-3">
                {customer.sessions.length === 0 ? (
                  <p className="text-sm text-slate-500">No session found.</p>
                ) : (
                  customer.sessions.map((session) => (
                    <div key={session.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black">
                        {session.ipAddress || "Unknown IP"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Recent Notifications
              </h2>

              <div className="mt-5 space-y-3">
                {customer.notifications.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No notification found.
                  </p>
                ) : (
                  customer.notifications.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-black">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.message}
                      </p>
                    </div>
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