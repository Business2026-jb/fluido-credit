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

export default async function AdminTransfersPage() {
  await requireAdmin();

  const transfers = await prisma.transaction.findMany({
    where: { type: "TRANSFER" },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      account: true,
    },
    take: 100,
  });

  const processing = transfers.filter((tx) => tx.status === "PROCESSING");
  const completed = transfers.filter((tx) => tx.status === "COMPLETED");
  const failed = transfers.filter((tx) => tx.status === "FAILED");
  const totalProcessing = processing.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Admin Transfer Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Transfer Review
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor customer transfers and update transaction status securely.
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
          <AdminStatCard title="Total Transfers" value={transfers.length} icon="🔁" tone="dark" />
          <AdminStatCard title="Processing" value={processing.length} icon="⏳" tone="amber" />
          <AdminStatCard title="Completed" value={completed.length} icon="✅" tone="green" />
          <AdminStatCard title="Failed" value={failed.length} icon="❌" tone="red" />
          <AdminStatCard title="Processing Amount" value={formatMoney(totalProcessing)} icon="💰" tone="blue" />
        </div>

        <div className="space-y-4">
          {transfers.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No transfers yet
              </h2>
              <p className="mt-2 text-slate-500">
                Customer transfer operations will appear here.
              </p>
            </div>
          ) : (
            transfers.map((tx) => (
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

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                        {tx.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Amount
                        </p>
                        <p className="mt-2 text-2xl font-black">
                          {formatMoney(tx.amount, tx.currency)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Direction
                        </p>
                        <p className="mt-2 text-2xl font-black">
                          {tx.direction}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Reference
                        </p>
                        <p className="mt-2 break-all text-sm font-black">
                          {tx.reference || "No reference"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p><strong>Customer:</strong> {tx.user.fullName}</p>
                      <p><strong>Email:</strong> {tx.user.email}</p>
                      <p><strong>Phone:</strong> {tx.user.phone}</p>
                      <p><strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                      <p><strong>Beneficiary:</strong> {tx.beneficiaryName || "Not provided"}</p>
                      <p><strong>BIC:</strong> {tx.beneficiaryBic || "Not provided"}</p>

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

                    <form
                      action="https://fluidocredit.com/api/admin/transfers/update-status"
                      method="POST"
                      className="mt-4 space-y-3"
                    >
                      <input type="hidden" name="transactionId" value={tx.id} />

                      <textarea
                        name="note"
                        placeholder="Admin note, banking reference or reason..."
                        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
                      />

                      <button name="status" value="PROCESSING" className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white">
                        Mark Processing
                      </button>

                      <button name="status" value="COMPLETED" className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white">
                        Mark Completed
                      </button>

                      <button name="status" value="FAILED" className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white">
                        Mark Failed
                      </button>

                      <button name="status" value="CANCELLED" className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-black text-white">
                        Cancel Transfer
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