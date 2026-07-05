import { FLUIDO_BIC, generateFluidoIban } from "@/lib/banking";
import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import CryptoTicker from "@/components/dashboard/CryptoTicker";
import ExchangeTicker from "@/components/dashboard/ExchangeTicker";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import AccountBalance from "@/components/dashboard/AccountBalance";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import RecentActivity from "@/components/dashboard/RecentActivity";
import NeedFinancing from "@/components/dashboard/NeedFinancing";
import MarketInsight from "@/components/dashboard/MarketInsight";
import LoanStatusBadge from "@/components/loan/LoanStatusBadge";

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      type: "MAIN",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        userId: user.id,
        name: "Main account",
        type: "MAIN",
        currency: "EUR",
        balance: 0,
        availableBalance: 0,
        blockedBalance: 0,
        iban: generateFluidoIban(user.id),
        bic: FLUIDO_BIC,
        isActive: true,
      },
    });
  }

  const [loans, transactions] = await Promise.all([
    prisma.loanApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),

    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const approvedLoans = loans.filter((loan) =>
    ["APPROVED", "FUNDED"].includes(loan.status)
  );

  const totalRequested = loans.reduce((sum, loan) => sum + loan.amount, 0);

  const totalApproved = approvedLoans.reduce(
    (sum, loan) => sum + loan.amount,
    0
  );

  const totalMonthlyPayment = loans.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );

  return (
    <AppShell>
      <main className="min-h-screen bg-[#F5F7FB]">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06183A] via-[#062B8C] to-[#0B5FFF] p-6 text-white shadow-2xl md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">
                  Fluido Credit Private Banking
                </p>

                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                  Welcome back, {user.fullName.split(" ")[0]}
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/loans/apply"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-black text-[#062B8C]"
                >
                  Request Loan
                </Link>

                <Link
                  href="/withdraw"
                  className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-center text-sm font-black text-white backdrop-blur hover:bg-white/20"
                >
                  Withdraw
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <CryptoTicker />
            <ExchangeTicker />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_390px]">
            <div className="space-y-8">
              <DashboardCharts transactions={transactions} />

              <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
                <AccountBalance account={account} />
                <QuickActions />
              </div>

              <FinancialSummary
                totalRequested={totalRequested}
                totalApproved={totalApproved}
                totalMonthlyPayment={totalMonthlyPayment}
              />

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
                      Financing
                    </span>

                    <h2 className="mt-5 text-3xl font-black text-[#06183A]">
                      Loan Requests
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Track your financing applications and repayment terms.
                    </p>
                  </div>

                  <Link href="/loans" className="font-black text-[#062B8C]">
                    View all
                  </Link>
                </div>

                {loans.length === 0 ? (
                  <div className="rounded-3xl bg-slate-50 p-10 text-center">
                    <h3 className="text-2xl font-black text-[#06183A]">
                      No loan request yet
                    </h3>

                    <p className="mt-3 text-slate-500">
                      Start your first secure financing request.
                    </p>

                    <Link
                      href="/loans/apply"
                      className="mt-8 inline-block rounded-2xl bg-[#062B8C] px-8 py-4 font-black text-white"
                    >
                      Apply Now
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {loans.map((loan) => (
                      <div
                        key={loan.id}
                        className="rounded-[2rem] border border-slate-200 bg-white p-5 transition hover:border-[#062B8C] hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="line-clamp-2 text-lg font-black text-[#06183A]">
                              {loan.purpose || "Loan Application"}
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                              {new Date(loan.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <LoanStatusBadge status={loan.status} />
                        </div>

                        <p className="mt-6 text-3xl font-black text-[#06183A]">
                          {formatMoney(loan.amount)}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-bold text-slate-400">
                              Duration
                            </p>
                            <p className="mt-1 font-black">
                              {loan.durationMonths} months
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-bold text-slate-400">
                              Monthly
                            </p>
                            <p className="mt-1 font-black">
                              {formatMoney(loan.monthlyPayment)}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/loans/${loan.id}`}
                          className="mt-6 block rounded-2xl bg-[#062B8C] py-4 text-center text-sm font-black text-white hover:bg-[#041f66]"
                        >
                          View details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-8">
              <NeedFinancing />
              <RecentActivity transactions={transactions} />
              <MarketInsight />
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}