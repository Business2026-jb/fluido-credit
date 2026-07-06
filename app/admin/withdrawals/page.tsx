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

function statusBadgeClass(status: string) {
  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-700";
  if (status === "PROCESSING") return "bg-amber-50 text-amber-700";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  if (status === "CANCELLED") return "bg-slate-100 text-slate-700";
  return "bg-blue-50 text-blue-700";
}

export default async function AdminWithdrawalsPage() {
  await requireAdmin();

  const withdrawals = await prisma.transaction.findMany({
    where: {
      type: "WITHDRAWAL",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      account: true,
    },
    take: 100,
  });

  const processing = withdrawals.filter((tx) => tx.status === "PROCESSING");
  const completed = withdrawals.filter((tx) => tx.status === "COMPLETED");
  const failed = withdrawals.filter((tx) => tx.status === "FAILED");
  const cancelled = withdrawals.filter((tx) => tx.status === "CANCELLED");

  const totalProcessing = processing.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Admin Withdrawal Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Withdrawal Review
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review customer withdrawal requests, validate payout processing,
              cancel failed payouts and keep customer accounts accurate.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#06183A]"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <AdminStatCard
            title="Total Withdrawals"
            value={withdrawals.length}
            icon="🏧"
            tone="dark"
          />

          <AdminStatCard
            title="Processing"
            value={processing.length}
            icon="⏳"
            tone="amber"
          />

          <AdminStatCard
            title="Completed"
            value={completed.length}
            icon="✅"
            tone="green"
          />

          <AdminStatCard
            title="Failed"
            value={failed.length}
            icon="❌"
            tone="red"
          />

          <AdminStatCard
            title="Pending Amount"
            value={formatMoney(totalProcessing)}
            icon="💰"
            tone="blue"
          />
        </div>

        <div className="space-y-5">
          {withdrawals.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No withdrawal requests yet
              </h2>

              <p className="mt-2 text-slate-500">
                Customer withdrawal requests will appear here.
              </p>
            </div>
          ) : (
            withdrawals.map((tx) => (
              <div
                key={tx.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-[#06183A]">
                        {tx.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusBadgeClass(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Amount
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#06183A]">
                          {formatMoney(tx.amount, tx.currency)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Direction
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#06183A]">
                          {tx.direction}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Reference
                        </p>
                        <p className="mt-2 break-all text-sm font-black text-[#06183A]">
                          {tx.reference || "No reference"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p>
                        <strong>Customer:</strong> {tx.user.fullName}
                      </p>

                      <p>
                        <strong>Email:</strong> {tx.user.email}
                      </p>

                      <p>
                        <strong>Phone:</strong> {tx.user.phone}
                      </p>

                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>

                      <p>
                        <strong>Beneficiary:</strong>{" "}
                        {tx.beneficiaryName || "Not provided"}
                      </p>

                      <p>
                        <strong>BIC:</strong>{" "}
                        {tx.beneficiaryBic || "Not provided"}
                      </p>

                      <p className="md:col-span-2">
                        <strong>IBAN:</strong>{" "}
                        <span className="break-all">
                          {tx.beneficiaryIban || "Not provided"}
                        </span>
                      </p>

                      <p className="md:col-span-2">
                        <strong>Description:</strong>{" "}
                        {tx.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-black text-[#06183A]">
                      Review action
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      If a withdrawal is failed or cancelled, the API must
                      restore the funds to the sender account automatically.
                    </p>

                    <form
                      action="https://fluidocredit.com/api/admin/withdrawals/update-status"
                      method="POST"
                      className="mt-4 space-y-3"
                    >
                      <input type="hidden" name="transactionId" value={tx.id} />

                      <textarea
                        name="note"
                        placeholder="Admin note, banking reference or reason..."
                        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
                      />

                      <button
                        name="status"
                        value="PROCESSING"
                        className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white"
                      >
                        Mark Processing
                      </button>

                      <button
                        name="status"
                        value="COMPLETED"
                        className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white"
                      >
                        Mark Completed
                      </button>

                      <button
                        name="status"
                        value="FAILED"
                        className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white"
                      >
                        Mark Failed & Refund
                      </button>

                      <button
                        name="status"
                        value="CANCELLED"
                        className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-black text-white"
                      >
                        Cancel & Refund
                      </button>
                    </form>
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