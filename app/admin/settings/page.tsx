import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getPlatformSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await getPlatformSettings();

  const groups = Array.from(new Set(settings.map((setting) => setting.group)));

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Settings
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Platform Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage real platform settings from the database.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <form action="/api/admin/settings/update" method="POST">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {groups.map((group) => (
                <div
                  key={group}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-black text-[#06183A]">
                    {group}
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {settings
                      .filter((setting) => setting.group === group)
                      .map((setting) => (
                        <div key={setting.key}>
                          <label className="text-sm font-bold text-slate-600">
                            {setting.label}
                          </label>

                          {setting.type === "BOOLEAN" ? (
                            <select
                              name={setting.key}
                              defaultValue={setting.value}
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                            >
                              <option value="true">Enabled</option>
                              <option value="false">Disabled</option>
                            </select>
                          ) : (
                            <input
                              name={setting.key}
                              type={
                                setting.type === "NUMBER" ||
                                setting.type === "PERCENT"
                                  ? "number"
                                  : setting.type === "EMAIL"
                                  ? "email"
                                  : "text"
                              }
                              step={setting.type === "PERCENT" ? "0.01" : undefined}
                              defaultValue={setting.value}
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                            />
                          )}

                          <p className="mt-1 text-xs font-bold text-slate-400">
                            Key: {setting.key}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
                <h2 className="text-xl font-black">Save Settings</h2>

                <p className="mt-3 text-sm leading-6 text-blue-100">
                  These values are stored in the database and can be reused by
                  loans, withdrawals, documents, notifications and emails.
                </p>

                <button className="mt-6 w-full rounded-2xl bg-white py-4 text-sm font-black text-[#062B8C]">
                  Save changes
                </button>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Quick Links
                </h2>

                <div className="mt-5 grid gap-3">
                  {[
                    ["Customers", "/admin/customers"],
                    ["Accounts", "/admin/accounts"],
                    ["Documents", "/admin/documents"],
                    ["Loans", "/admin/loans"],
                    ["Withdrawals", "/admin/withdrawals"],
                    ["Transfers", "/admin/transfers"],
                    ["Transactions", "/admin/transactions"],
                    ["Notifications", "/admin/notifications"],
                  ].map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black hover:border-blue-600 hover:bg-blue-50"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6">
                <h2 className="text-xl font-black text-red-700">
                  Security Notice
                </h2>

                <p className="mt-3 text-sm leading-6 text-red-600">
                  Do not store database passwords, SMTP passwords or API keys in
                  these settings. Sensitive secrets must stay inside .env.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}