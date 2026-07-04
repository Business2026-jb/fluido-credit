import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOTAL_REQUIRED_DOCUMENTS = 6;

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [documents, account] = await Promise.all([
    prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.account.findFirst({
      where: { userId: user.id, type: "MAIN" },
    }),
  ]);

  const approvedDocs = documents.filter((doc) => doc.status === "APPROVED");
  const pendingDocs = documents.filter((doc) => doc.status === "PENDING");

  const kycProgress = Math.min(
    Math.round(
      ((approvedDocs.length + pendingDocs.length) / TOTAL_REQUIRED_DOCUMENTS) *
        100
    ),
    100
  );

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Customer Profile
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Personal Information
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your identity, contact details and banking profile.
            </p>
          </div>

          <Link
            href="/documents"
            className="rounded-2xl bg-[#062B8C] px-5 py-3 text-center text-sm font-black text-white"
          >
            Verification
          </Link>
        </div>

        <div className="mb-6 rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold text-blue-100">
                Verification status
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {kycProgress >= 100
                  ? "Your profile is fully verified"
                  : "Complete your verification"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Verification helps protect your account and enables full banking
                access.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
              <p className="text-4xl font-black">{kycProgress}%</p>
              <p className="text-xs font-bold text-blue-100">Complete</p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${kycProgress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Personal Details
              </h2>

              <form
                action="/api/profile/update"
                method="POST"
                className="mt-6 grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Full name
                  </label>
                  <input
                    name="fullName"
                    defaultValue={user.fullName}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Email
                  </label>
                  <input
                    defaultValue={user.email}
                    readOnly
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4 font-semibold text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Phone
                  </label>
                  <input
                    name="phone"
                    defaultValue={user.phone || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Country code
                  </label>
                  <input
                    name="countryCode"
                    defaultValue={user.countryCode || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Country
                  </label>
                  <input
                    name="country"
                    defaultValue={user.country || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    City
                  </label>
                  <input
                    name="city"
                    defaultValue={user.city || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">
                    Address
                  </label>
                  <input
                    name="address"
                    defaultValue={user.address || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Postal code
                  </label>
                  <input
                    name="postalCode"
                    defaultValue={user.postalCode || ""}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button className="w-full rounded-2xl bg-[#062B8C] px-5 py-4 text-sm font-black text-white">
                    Save changes
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-black text-[#06183A]">
                    Verification Documents
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest documents submitted for identity verification.
                  </p>
                </div>

                <Link
                  href="/documents"
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-black"
                >
                  Manage documents
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {documents.length === 0 ? (
                  <div className="rounded-3xl bg-blue-50 p-6 text-center">
                    <h3 className="font-black text-[#06183A]">
                      No document uploaded yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Upload your documents to complete verification.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="font-black text-[#06183A]">{doc.type}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {doc.fileName}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                          doc.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : doc.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Account Details
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-slate-500">IBAN</p>
                  <p className="mt-1 break-all font-black">
                    {account?.iban || "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-slate-500">BIC / SWIFT</p>
                  <p className="mt-1 font-black">
                    {account?.bic || "Not available"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-slate-500">Currency</p>
                    <p className="mt-1 font-black">
                      {account?.currency || "EUR"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-slate-500">Status</p>
                    <p className="mt-1 font-black">
                      {account?.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Security</h2>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Email verification</p>
                  <p className="mt-1 font-black">
                    {user.emailVerified ? "Verified" : "Pending"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Account status</p>
                  <p className="mt-1 font-black">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}