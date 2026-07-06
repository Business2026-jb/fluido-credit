import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";

const APP_URL = "https://fluidocredit.com";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

function statusBadgeClass(status: string) {
  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  if (status === "CANCELLED") return "bg-slate-100 text-slate-700";
  return "bg-blue-50 text-blue-700";
}

function methodLabel(method: string) {
  if (method === "USDT_TRC20") return "USDT TRC20";
  if (method === "BANK_TRANSFER") return "Bank Transfer";
  return method;
}

export default async function AdminDepositsPage() {
  await requireAdmin();

  const deposits = await prisma.depositRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      account: true,
    },
    take: 100,
  });

  const pending = deposits.filter((d) => d.status === "PENDING");
  const completed = deposits.filter((d) => d.status === "COMPLETED");
  const rejected = deposits.filter((d) => d.status === "REJECTED");
  const cancelled = deposits.filter((d) => d.status === "CANCELLED");

  const totalPending = pending.reduce((sum, d) => sum + d.amount, 0);

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Admin Deposit Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Deposit Review
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review customer deposits, verify payment proof and credit Fluido
              balances after confirmation.
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
            title="Total Deposits"
            value={deposits.length}
            icon="💳"
            tone="dark"
          />

          <AdminStatCard
            title="Pending"
            value={pending.length}
            icon="⏳"
            tone="amber"
          />

          <AdminStatCard
            title="Approved"
            value={completed.length}
            icon="✅"
            tone="green"
          />

          <AdminStatCard
            title="Rejected"
            value={rejected.length + cancelled.length}
            icon="❌"
            tone="red"
          />

          <AdminStatCard
            title="Pending Amount"
            value={formatMoney(totalPending)}
            icon="💰"
            tone="blue"
          />
        </div>

        <div className="space-y-5">
          {deposits.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No deposit requests yet
              </h2>

              <p className="mt-2 text-slate-500">
                Customer deposit requests will appear here.
              </p>
            </div>
          ) : (
            deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-[#06183A]">
                        {methodLabel(deposit.method)} Deposit
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusBadgeClass(
                          deposit.status
                        )}`}
                      >
                        {deposit.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Amount
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#06183A]">
                          {formatMoney(deposit.amount, deposit.currency)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Method
                        </p>
                        <p className="mt-2 text-xl font-black text-[#06183A]">
                          {methodLabel(deposit.method)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Reference
                        </p>
                        <p className="mt-2 break-all text-sm font-black text-[#06183A]">
                          {deposit.reference}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p>
                        <strong>Customer:</strong> {deposit.user.fullName}
                      </p>

                      <p>
                        <strong>Email:</strong> {deposit.user.email}
                      </p>

                      <p>
                        <strong>Phone:</strong> {deposit.user.phone}
                      </p>

                      <p>
                        <strong>Country:</strong> {deposit.user.country}
                      </p>

                      <p>
                        <strong>User ID:</strong>{" "}
                        <span className="break-all">{deposit.userId}</span>
                      </p>

                      <p>
                        <strong>Account:</strong>{" "}
                        {deposit.account?.iban || "No IBAN"}
                      </p>

                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(deposit.createdAt).toLocaleString()}
                      </p>

                      <p>
                        <strong>Reviewed:</strong>{" "}
                        {deposit.reviewedAt
                          ? new Date(deposit.reviewedAt).toLocaleString()
                          : "Not reviewed"}
                      </p>

                      <p className="md:col-span-2">
                        <strong>Proof file:</strong>{" "}
                        {deposit.proofFileName || "Not provided"}
                      </p>

                      {deposit.adminNote && (
                        <p className="md:col-span-2">
                          <strong>Admin note:</strong> {deposit.adminNote}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {deposit.proofFileUrl ? (
                        <>
                          <a
                            href={`${APP_URL}/api/files/deposit-proof?path=${encodeURIComponent(
                              deposit.proofFileUrl
                            )}`}
                            target="_blank"
                            className="rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white"
                          >
                            Open Proof
                          </a>

                          <a
                            href={`${APP_URL}/api/files/deposit-proof?path=${encodeURIComponent(
                              deposit.proofFileUrl
                            )}&download=1`}
                            target="_blank"
                            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#06183A]"
                          >
                            Download Proof
                          </a>
                        </>
                      ) : (
                        <span className="rounded-2xl bg-red-50 px-5 py-3 text-sm font-black text-red-700">
                          No proof uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-black text-[#06183A]">
                      Review action
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Approving a deposit credits the customer balance
                      automatically. Reject only if the payment was not received
                      or could not be confirmed.
                    </p>

                    <form
                      action={`${APP_URL}/api/admin/deposits/update-status`}
                      method="POST"
                      className="mt-4 space-y-3"
                    >
                      <input type="hidden" name="depositId" value={deposit.id} />

                      <textarea
                        name="adminNote"
                        placeholder="Admin note, payment reference, blockchain hash, rejection reason..."
                        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
                      />

                      <button
                        name="status"
                        value="COMPLETED"
                        className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white"
                      >
                        Approve & Credit Balance
                      </button>

                      <button
                        name="status"
                        value="PENDING"
                        className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white"
                      >
                        Request More Information
                      </button>

                      <button
                        name="status"
                        value="REJECTED"
                        className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white"
                      >
                        Reject - Payment Not Received
                      </button>

                      <button
                        name="status"
                        value="CANCELLED"
                        className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-black text-white"
                      >
                        Cancel Deposit
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