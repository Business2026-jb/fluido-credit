import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";

const APP_URL = "https://fluidocredit.com";

function statusLabel(status: string) {
  if (status === "REQUESTED") return "Requested";
  if (status === "IN_PRODUCTION") return "In production";
  if (status === "SHIPPING") return "Shipping";
  if (status === "DELIVERED") return "Delivered";
  if (status === "ACTIVE") return "Active";
  if (status === "CANCELLED") return "Cancelled";
  return status;
}

function statusBadgeClass(status: string) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-700";
  if (status === "DELIVERED") return "bg-blue-50 text-[#062B8C]";
  if (status === "SHIPPING") return "bg-indigo-50 text-indigo-700";
  if (status === "IN_PRODUCTION") return "bg-amber-50 text-amber-700";
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  return "bg-slate-100 text-slate-700";
}

function shortCardNumber(value?: string | null) {
  if (!value) return "Not generated";
  return value;
}

export default async function AdminPhysicalCardsPage() {
  await requireAdmin();

  const cards = await prisma.physicalCardRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
    take: 100,
  });

  const requested = cards.filter((card) => card.status === "REQUESTED");
  const production = cards.filter((card) => card.status === "IN_PRODUCTION");
  const shipping = cards.filter((card) => card.status === "SHIPPING");
  const delivered = cards.filter((card) => card.status === "DELIVERED");
  const active = cards.filter((card) => card.status === "ACTIVE");
  const cancelled = cards.filter((card) => card.status === "CANCELLED");

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Admin Card Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Physical Cards
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage physical card requests, delivery status and activation.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#06183A]"
          >
            Back to Admin
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-6">
          <AdminStatCard
            title="Total"
            value={cards.length}
            icon="💳"
            tone="dark"
          />

          <AdminStatCard
            title="Requested"
            value={requested.length}
            icon="📝"
            tone="amber"
          />

          <AdminStatCard
            title="Production"
            value={production.length}
            icon="🏭"
            tone="blue"
          />

          <AdminStatCard
            title="Shipping"
            value={shipping.length}
            icon="🚚"
            tone="blue"
          />

          <AdminStatCard
            title="Active"
            value={active.length}
            icon="✅"
            tone="green"
          />

          <AdminStatCard
            title="Cancelled"
            value={cancelled.length}
            icon="❌"
            tone="red"
          />
        </div>

        <div className="space-y-5">
          {cards.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No physical card requests yet
              </h2>

              <p className="mt-2 text-slate-500">
                Customer physical card requests will appear here.
              </p>
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-[#06183A]">
                        {card.user.fullName}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusBadgeClass(
                          card.status
                        )}`}
                      >
                        {statusLabel(card.status)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Card number
                        </p>
                        <p className="mt-2 break-all text-sm font-black text-[#06183A]">
                          {shortCardNumber(card.maskedNumber)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Expiry
                        </p>
                        <p className="mt-2 text-xl font-black text-[#06183A]">
                          {card.expiry || "--/--"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          Request date
                        </p>
                        <p className="mt-2 text-sm font-black text-[#06183A]">
                          {new Date(card.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                      <p>
                        <strong>Customer:</strong> {card.user.fullName}
                      </p>

                      <p>
                        <strong>Email:</strong> {card.user.email}
                      </p>

                      <p>
                        <strong>Phone:</strong> {card.user.phone}
                      </p>

                      <p>
                        <strong>User ID:</strong>{" "}
                        <span className="break-all">{card.userId}</span>
                      </p>

                      <p>
                        <strong>Delivery country:</strong> {card.country}
                      </p>

                      <p>
                        <strong>Delivery city:</strong> {card.city}
                      </p>

                      <p className="md:col-span-2">
                        <strong>Delivery address:</strong>{" "}
                        {card.deliveryAddress}
                      </p>

                      <p>
                        <strong>Activated:</strong>{" "}
                        {card.activatedAt
                          ? new Date(card.activatedAt).toLocaleString()
                          : "Not active"}
                      </p>

                      <p>
                        <strong>Delivered:</strong>{" "}
                        {card.deliveredAt
                          ? new Date(card.deliveredAt).toLocaleString()
                          : "Not delivered"}
                      </p>

                      {card.adminNote && (
                        <p className="md:col-span-2">
                          <strong>Admin note:</strong> {card.adminNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-black text-[#06183A]">
                      Card actions
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Each action sends an automatic email to the customer.
                    </p>

                    <form
                      action={`${APP_URL}/api/admin/cards/physical/update-status`}
                      method="POST"
                      className="mt-4 space-y-3"
                    >
                      <input type="hidden" name="cardId" value={card.id} />

                      <textarea
                        name="adminNote"
                        placeholder="Admin note, shipping reference, cancellation reason..."
                        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
                      />

                      <button
                        name="status"
                        value="IN_PRODUCTION"
                        className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white"
                      >
                        Mark In Production
                      </button>

                      <button
                        name="status"
                        value="SHIPPING"
                        className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-black text-white"
                      >
                        Mark Shipping
                      </button>

                      <button
                        name="status"
                        value="DELIVERED"
                        className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white"
                      >
                        Mark Delivered
                      </button>

                      <button
                        name="status"
                        value="ACTIVE"
                        className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white"
                      >
                        Activate Card
                      </button>

                      <button
                        name="status"
                        value="CANCELLED"
                        className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white"
                      >
                        Cancel Card
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