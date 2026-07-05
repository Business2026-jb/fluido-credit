import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import LoanStatusBadge from "@/components/loan/LoanStatusBadge";
import AdminStatCard from "@/components/admin/AdminStatCard";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function AdminLoansPage() {
  await requireAdmin();

  const loans = await prisma.loanApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      documents: true,
      payments: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
    take: 100,
  });

  const pending = loans.filter((loan) =>
    ["SUBMITTED", "UNDER_REVIEW"].includes(loan.status)
  );

  const approved = loans.filter((loan) => loan.status === "APPROVED");
  const funded = loans.filter((loan) => loan.status === "FUNDED");
  const rejected = loans.filter((loan) => loan.status === "REJECTED");

  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const fundedAmount = funded.reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Admin Loan Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Loan Review & Funding
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review loan applications, approve financing and release funds to customer accounts.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <AdminStatCard title="Total Loans" value={loans.length} icon="💶" tone="dark" />
          <AdminStatCard title="Pending Review" value={pending.length} icon="⏳" tone="amber" />
          <AdminStatCard title="Approved" value={approved.length} icon="✅" tone="green" />
          <AdminStatCard title="Funded" value={funded.length} icon="🏦" tone="blue" />
        </div>

        <div className="mb-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-blue-100">Total requested</p>
            <p className="mt-3 text-3xl font-black">{formatMoney(totalAmount)}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Funded amount</p>
            <p className="mt-3 text-3xl font-black text-emerald-600">
              {formatMoney(fundedAmount)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Rejected</p>
            <p className="mt-3 text-3xl font-black text-red-500">
              {rejected.length}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {loans.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No loan applications yet
              </h2>
              <p className="mt-2 text-slate-500">
                Customer loan applications will appear here.
              </p>
            </div>
          ) : (
            loans.map((loan) => (
              <div
                key={loan.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-[#06183A]">
                        {loan.purpose || "Loan application"}
                      </h2>
                      <LoanStatusBadge status={loan.status} />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Amount</p>
                        <p className="mt-2 text-2xl font-black">
                          {formatMoney(loan.amount)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Monthly</p>
                        <p className="mt-2 text-2xl font-black">
                          {formatMoney(loan.monthlyPayment)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Rate / Term</p>
                        <p className="mt-2 text-2xl font-black">
                          {loan.annualRate}% · {loan.durationMonths} mo
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p>
                        <strong>Customer:</strong> {loan.user.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {loan.user.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {loan.user.phone || "Not provided"}
                      </p>
                      <p>
                        <strong>Country:</strong> {loan.user.country || "Not provided"}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {loan.submittedAt
                          ? new Date(loan.submittedAt).toLocaleString()
                          : "Not submitted"}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(loan.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Documents:</strong> {loan.documents.length}
                      </p>
                      <p>
                        <strong>Payments:</strong> {loan.payments.length}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                      <p className="text-sm font-black text-[#06183A]">
                        Status history
                      </p>

                      <div className="mt-3 space-y-2">
                        {loan.statusHistory.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No status history yet.
                          </p>
                        ) : (
                          loan.statusHistory.slice(0, 4).map((item) => (
                            <div key={item.id} className="text-sm text-slate-600">
                              <strong>{item.status}</strong> ·{" "}
                              {new Date(item.createdAt).toLocaleString()}
                              {item.note ? ` · ${item.note}` : ""}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <h3 className="font-black text-[#06183A]">Review action</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Use <strong>Mark Funded</strong> only when the money must be credited to the customer balance.
                    </p>

                    <form
                      action="https://fluidocredit.com/api/admin/loans/update-status"
                      method="POST"
                      className="mt-5 space-y-3"
                    >
                      <input type="hidden" name="loanId" value={loan.id} />

                      <textarea
                        name="note"
                        placeholder="Decision note or comment..."
                        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
                      />

                      <button
                        name="status"
                        value="UNDER_REVIEW"
                        className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white"
                      >
                        Mark Under Review
                      </button>

                      <button
                        name="status"
                        value="APPROVED"
                        className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white"
                      >
                        Approve Loan
                      </button>

                      <button
                        name="status"
                        value="FUNDED"
                        disabled={loan.status === "FUNDED"}
                        className="w-full rounded-2xl bg-blue-700 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loan.status === "FUNDED"
                          ? "Already Funded"
                          : "Mark Funded & Credit Account"}
                      </button>

                      <button
                        name="status"
                        value="REJECTED"
                        className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white"
                      >
                        Reject Loan
                      </button>
                    </form>

                    {loan.status === "FUNDED" && (
                      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                        Funds have already been released to the customer account.
                      </div>
                    )}
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