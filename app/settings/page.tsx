import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/AppShell";
import PushNotificationButton from "@/components/app/PushNotificationButton";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function valueOrEmpty(value?: string | null) {
  return value && value.trim() ? value : "Not provided";
}

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [documents, accounts, sessions] = await Promise.all([
    prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),

    prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),

    prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const approvedDocuments = documents.filter(
    (document) => document.status === "APPROVED"
  ).length;

  const pendingDocuments = documents.filter(
    (document) => document.status === "PENDING"
  ).length;

  const rejectedDocuments = documents.filter(
    (document) => document.status === "REJECTED"
  ).length;

  const mainAccount = accounts.find((account) => account.type === "MAIN");

  return (
    <AppShell>
      <main className="min-h-screen bg-[#F5F7FB]">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
                Fluido Credit Settings
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your profile, security, notifications and verification.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
            >
              Dashboard
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-black text-[#06183A]">
                      Profile information
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Your personal information used for your Fluido Credit
                      account.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-black ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {user.isActive ? "Active account" : "Pending activation"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Full name", user.fullName],
                    ["Email", user.email],
                    ["Phone", user.phone],
                    ["Country", user.country],
                    ["Country code", user.countryCode],
                    ["City", user.city],
                    ["Address", user.address],
                    ["Postal code", user.postalCode],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 break-all font-black text-[#06183A]">
                        {valueOrEmpty(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Account details
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Currency
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#062B8C]">
                      {mainAccount?.currency || "EUR"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Account type
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#06183A]">
                      {mainAccount?.type || "MAIN"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Account status
                    </p>
                    <p className="mt-2 text-2xl font-black text-emerald-700">
                      {mainAccount?.isActive ? "Active" : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">IBAN</p>
                  <p className="mt-2 break-all font-black text-[#06183A]">
                    {mainAccount?.iban || "Not available"}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">BIC</p>
                  <p className="mt-2 break-all font-black text-[#06183A]">
                    {mainAccount?.bic || "Not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Security
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Link
                    href="/forgot-password"
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-black text-[#06183A] transition hover:border-[#062B8C] hover:bg-blue-50"
                  >
                    Change password
                  </Link>

                  <Link
                    href="/documents"
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-black text-[#06183A] transition hover:border-[#062B8C] hover:bg-blue-50"
                  >
                    Manage verification
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Last login
                  </p>
                  <p className="mt-2 font-black text-[#06183A]">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "No login history"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Verification
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Email
                    </p>
                    <p
                      className={`mt-2 font-black ${
                        user.emailVerified
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Approved
                    </p>
                    <p className="mt-2 text-2xl font-black text-emerald-700">
                      {approvedDocuments}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Pending
                    </p>
                    <p className="mt-2 text-2xl font-black text-amber-700">
                      {pendingDocuments}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Rejected
                    </p>
                    <p className="mt-2 text-2xl font-black text-red-700">
                      {rejectedDocuments}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Recent sessions
                </h2>

                <div className="mt-5 space-y-3">
                  {sessions.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                      No active sessions found.
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="text-sm font-black text-[#06183A]">
                          Session created
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {new Date(session.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <PushNotificationButton />

              <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
                <h2 className="text-xl font-black">Notifications</h2>

                <div className="mt-5 space-y-3 text-sm text-blue-100">
                  <p className="rounded-2xl bg-white/10 p-4">
                    Deposit alerts
                  </p>
                  <p className="rounded-2xl bg-white/10 p-4">
                    Transfer alerts
                  </p>
                  <p className="rounded-2xl bg-white/10 p-4">
                    Loan updates
                  </p>
                  <p className="rounded-2xl bg-white/10 p-4">
                    Card status alerts
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Preferences
                </h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      Language
                    </p>
                    <p className="mt-2 font-black text-[#06183A]">
                      English
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      Currency
                    </p>
                    <p className="mt-2 font-black text-[#06183A]">EUR</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6">
                <h2 className="text-lg font-black text-red-700">
                  Support
                </h2>

                <p className="mt-3 text-sm leading-6 text-red-700">
                  For sensitive account changes, contact Fluido Credit support.
                </p>

                <Link
                  href="/support"
                  className="mt-5 block rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-black text-white"
                >
                  Contact support
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}