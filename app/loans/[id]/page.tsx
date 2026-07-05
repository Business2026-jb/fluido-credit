import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LoanStatusBadge from "@/components/loan/LoanStatusBadge";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const loan = await prisma.loanApplication.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!loan) {
    notFound();
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Loan Details
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              {loan.purpose || "Loan Application"}
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-bold text-blue-100">Requested amount</p>
              <p className="mt-3 text-4xl font-black">
                {formatMoney(loan.amount)}
              </p>

              <p className="mt-4 text-sm text-blue-100">
                Submitted on {new Date(loan.createdAt).toLocaleDateString()}
              </p>
            </div>

            <LoanStatusBadge status={loan.status} />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Monthly payment</p>
            <p className="mt-3 text-2xl font-black text-[#06183A]">
              {formatMoney(loan.monthlyPayment)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Duration</p>
            <p className="mt-3 text-2xl font-black text-[#06183A]">
              {loan.durationMonths} months
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Interest rate</p>
            <p className="mt-3 text-2xl font-black text-[#06183A]">
              {loan.annualRate}%
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#06183A]">
            Application summary
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 font-black">{loan.status}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="mt-1 break-all font-black">{loan.id}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Purpose</p>
              <p className="mt-1 font-black">
                {loan.purpose || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}