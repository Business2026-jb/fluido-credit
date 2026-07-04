import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getNotificationIcon(title: string, message: string) {
  const text = `${title} ${message}`.toLowerCase();

  if (text.includes("document")) return "📄";
  if (text.includes("loan")) return "💶";
  if (text.includes("withdrawal")) return "🏧";
  if (text.includes("transfer")) return "🔁";
  if (text.includes("profile")) return "👤";
  if (text.includes("card")) return "💳";
  if (text.includes("security") || text.includes("session")) return "🔐";

  return "🔔";
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const unread = notifications.filter((item) => !item.isRead);
  const read = notifications.filter((item) => item.isRead);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Notification Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              My Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              All important banking updates about your profile, documents,
              loans, withdrawals, transfers, cards and security activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {unread.length > 0 && (
              <form action="/api/notifications/mark-all-read" method="POST">
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#06183A]">
                  Mark all as read
                </button>
              </form>
            )}

            <Link
              href="/dashboard"
              className="rounded-2xl bg-[#062B8C] px-5 py-3 text-center text-sm font-black text-white"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-[#06183A] p-5 text-white shadow-sm">
            <div className="text-2xl">🔔</div>
            <p className="mt-3 text-sm font-bold text-blue-100">Total</p>
            <p className="mt-2 text-3xl font-black">{notifications.length}</p>
          </div>

          <div className="rounded-[1.5rem] bg-amber-50 p-5 text-amber-700 shadow-sm">
            <div className="text-2xl">📩</div>
            <p className="mt-3 text-sm font-bold">Unread</p>
            <p className="mt-2 text-3xl font-black">{unread.length}</p>
          </div>

          <div className="rounded-[1.5rem] bg-emerald-50 p-5 text-emerald-700 shadow-sm">
            <div className="text-2xl">✅</div>
            <p className="mt-3 text-sm font-bold">Read</p>
            <p className="mt-2 text-3xl font-black">{read.length}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#06183A]">
              Notification History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete history of actions and alerts linked to your account.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-3xl bg-blue-50 p-8 text-center">
                <h3 className="text-xl font-black text-[#06183A]">
                  No notification yet
                </h3>
                <p className="mt-3 text-slate-500">
                  Your banking alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const icon = getNotificationIcon(item.title, item.message);

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 ${
                      item.isRead
                        ? "border-slate-100 bg-slate-50"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          {icon}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-black text-[#06183A]">
                              {item.title}
                            </h3>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                              {item.type}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${
                                item.isRead
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.isRead ? "Read" : "Unread"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.message}
                          </p>

                          <p className="mt-3 text-xs font-bold text-slate-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {!item.isRead && (
                        <form
                          action="/api/notifications/mark-read"
                          method="POST"
                        >
                          <input
                            type="hidden"
                            name="notificationId"
                            value={item.id}
                          />

                          <button className="rounded-2xl bg-[#062B8C] px-4 py-3 text-sm font-black text-white">
                            Mark as read
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}