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

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      accounts: true,
      loanApplications: true,
      documents: true,
      transactions: true,
      sessions: true,
    },
    take: 100,
  });

  const activeCustomers = customers.filter((c) => c.isActive);
  const verifiedCustomers = customers.filter((c) => c.emailVerified);
  const pendingCustomers = customers.filter((c) => !c.emailVerified);

  const totalBalance = customers.reduce((sum, customer) => {
    return (
      sum +
      customer.accounts.reduce((accountSum, account) => {
        return accountSum + account.balance;
      }, 0)
    );
  }, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Customer Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Customers
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View all Fluido Credit customers, accounts, loans, documents and activity.
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
          <AdminStatCard title="Total Customers" value={customers.length} icon="👥" tone="dark" />
          <AdminStatCard title="Active" value={activeCustomers.length} icon="✅" tone="green" />
          <AdminStatCard title="Verified" value={verifiedCustomers.length} icon="🛡️" tone="blue" />
          <AdminStatCard title="Pending" value={pendingCustomers.length} icon="⏳" tone="amber" />
        </div>

        <div className="mb-6 rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
          <p className="text-sm font-bold text-blue-100">
            Total customer balances
          </p>
          <p className="mt-3 text-4xl font-black">
            {formatMoney(totalBalance)}
          </p>
        </div>

        <div className="space-y-4">
          {customers.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No customers yet
              </h2>
              <p className="mt-2 text-slate-500">
                Registered customers will appear here.
              </p>
            </div>
          ) : (
            customers.map((customer) => {
              const balance = customer.accounts.reduce(
                (sum, account) => sum + account.balance,
                0
              );

              return (
                <div
                  key={customer.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-black text-[#06183A]">
                          {customer.fullName}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            customer.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            customer.emailVerified
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.emailVerified ? "Verified" : "Pending"}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Phone:</strong> {customer.phone}</p>
                        <p><strong>Country:</strong> {customer.country}</p>
                        <p><strong>City:</strong> {customer.city}</p>
                        <p><strong>Address:</strong> {customer.address}</p>
                        <p><strong>Postal code:</strong> {customer.postalCode}</p>
                        <p><strong>Registered:</strong> {new Date(customer.createdAt).toLocaleString()}</p>
                        <p><strong>Last login:</strong> {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : "Not available"}</p>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-4">
                      <h3 className="font-black text-[#06183A]">
                        Customer overview
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <p><strong>Balance:</strong> {formatMoney(balance)}</p>
                        <p><strong>Accounts:</strong> {customer.accounts.length}</p>
                        <p><strong>Loans:</strong> {customer.loanApplications.length}</p>
                        <p><strong>Documents:</strong> {customer.documents.length}</p>
                        <p><strong>Transactions:</strong> {customer.transactions.length}</p>
                        <p><strong>Sessions:</strong> {customer.sessions.length}</p>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="rounded-2xl bg-[#062B8C] px-4 py-3 text-center text-sm font-black text-white"
                        >
                          View full profile
                        </Link>

                        <Link
                          href={`/admin/documents`}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black"
                        >
                          View documents
                        </Link>
                      </div>
                    </div>
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