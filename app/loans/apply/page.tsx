"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/app/AppShell";

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function ApplyLoanPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    amount: 15000,
    durationMonths: 60,
    purpose: "",
    monthlyIncome: "",
    employmentStatus: "",
    employerName: "",
    monthlyExpenses: "",
    existingLoans: "No",
    housingStatus: "",
    maritalStatus: "",
    children: "0",
    acceptedTerms: false,
  });

  const annualRate = 6.9;

  const monthlyPayment = useMemo(() => {
    const amount = Number(form.amount);
    const term = Number(form.durationMonths);
    const monthlyRate = annualRate / 100 / 12;

    return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }, [form.amount, form.durationMonths]);

  const totalDue = monthlyPayment * Number(form.durationMonths);
  const totalInterest = totalDue - Number(form.amount);
  const validationReserve = Number(form.amount) * 0.1;

  const monthlyIncome = Number(form.monthlyIncome || 0);
  const monthlyExpenses = Number(form.monthlyExpenses || 0);
  const remainingIncome = monthlyIncome - monthlyExpenses - monthlyPayment;
  const debtRatio =
    monthlyIncome > 0 ? Math.round((monthlyPayment / monthlyIncome) * 100) : 0;

  function update(field: string, value: string | number | boolean) {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.acceptedTerms) {
      setError("You must confirm that the information provided is accurate.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to submit your application.");
        return;
      }

      setSuccess("Your loan application has been submitted successfully.");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1600);
    } catch {
      setError("Unable to submit your application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Secure Loan Application
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Apply for a Personal Loan
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Choose your amount and repayment duration. Your estimate updates instantly.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <form
            onSubmit={submitApplication}
            className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
          >
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                {success}
              </div>
            )}

            <div>
              <h2 className="text-xl font-black text-[#06183A]">Loan Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the financing amount, duration and purpose.
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">
                Loan amount
              </label>

              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <span className="mr-2 text-xl font-black">€</span>
                <input
                  type="number"
                  min={1000}
                  max={50000}
                  step={500}
                  value={form.amount}
                  onChange={(e) => update("amount", Number(e.target.value))}
                  className="w-full bg-transparent text-3xl font-black outline-none"
                />
              </div>

              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={form.amount}
                onChange={(e) => update("amount", Number(e.target.value))}
                className="mt-4 w-full accent-[#062B8C]"
              />

              <div className="mt-1 flex justify-between text-xs font-bold text-slate-400">
                <span>€1,000</span>
                <span>€50,000</span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Repayment duration
                </label>
                <select
                  value={form.durationMonths}
                  onChange={(e) =>
                    update("durationMonths", Number(e.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                  <option value={60}>60 months</option>
                  <option value={72}>72 months</option>
                  <option value={84}>84 months</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Loan purpose
                </label>
                <select
                  required
                  value={form.purpose}
                  onChange={(e) => update("purpose", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value="">Select purpose</option>
                  <option value="Personal project">Personal project</option>
                  <option value="Home improvement">Home improvement</option>
                  <option value="Vehicle purchase">Vehicle purchase</option>
                  <option value="Debt consolidation">Debt consolidation</option>
                  <option value="Education">Education</option>
                  <option value="Business support">Business support</option>
                  <option value="Medical expenses">Medical expenses</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-black text-[#06183A]">
                Validation reserve required
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                To validate and credit this loan, 10% of the requested amount must be
                available on your Fluido Credit account or paid before final funding.
              </p>
              <p className="mt-4 text-3xl font-black text-[#062B8C]">
                {formatEuro(validationReserve)}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-xl font-black text-[#06183A]">
                Financial Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This information helps us review your repayment capacity.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Monthly income
                </label>
                <input
                  required
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => update("monthlyIncome", e.target.value)}
                  placeholder="3500"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Monthly expenses
                </label>
                <input
                  type="number"
                  value={form.monthlyExpenses}
                  onChange={(e) => update("monthlyExpenses", e.target.value)}
                  placeholder="1200"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Employment status
                </label>
                <select
                  required
                  value={form.employmentStatus}
                  onChange={(e) => update("employmentStatus", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value="">Select status</option>
                  <option value="Permanent employee">Permanent employee</option>
                  <option value="Temporary employee">Temporary employee</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Business owner">Business owner</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Employer / Company name
                </label>
                <input
                  value={form.employerName}
                  onChange={(e) => update("employerName", e.target.value)}
                  placeholder="Company name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Existing loans
                </label>
                <select
                  value={form.existingLoans}
                  onChange={(e) => update("existingLoans", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Housing status
                </label>
                <select
                  value={form.housingStatus}
                  onChange={(e) => update("housingStatus", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value="">Select housing status</option>
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Living with family">Living with family</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Marital status
                </label>
                <select
                  value={form.maritalStatus}
                  onChange={(e) => update("maritalStatus", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none"
                >
                  <option value="">Select marital status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Number of children
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.children}
                  onChange={(e) => update("children", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <label className="flex gap-3 text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(e) => update("acceptedTerms", e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I confirm that the information provided is accurate and I understand
                  that 10% of the requested amount must be available or paid before the loan is credited.
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-70"
            >
              {loading ? "Submitting application..." : "Submit Loan Application"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <p className="text-sm font-bold text-blue-100">Loan estimate</p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-blue-100">Requested amount</p>
                  <p className="text-3xl font-black">
                    {formatEuro(form.amount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-100">Duration</p>
                    <p className="text-xl font-black">
                      {form.durationMonths} months
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-100">Annual rate</p>
                    <p className="text-xl font-black">{annualRate}%</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Monthly payment</p>
                  <p className="mt-2 text-3xl font-black">
                    {formatEuro(monthlyPayment)}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-400/15 p-4">
                  <p className="text-sm text-amber-100">
                    Required 10% validation reserve
                  </p>
                  <p className="mt-2 text-3xl font-black text-amber-200">
                    {formatEuro(validationReserve)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100">Interest</p>
                    <p className="font-black">{formatEuro(totalInterest)}</p>
                  </div>

                  <div>
                    <p className="text-blue-100">Total due</p>
                    <p className="font-black">{formatEuro(totalDue)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Eligibility preview
              </h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">
                    Debt-to-income ratio
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#06183A]">
                    {debtRatio}%
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">
                    Remaining income after repayment
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${
                      remainingIncome >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {formatEuro(remainingIncome)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-black text-amber-700">
                    Important requirement
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The loan can be approved after review, but it will only be credited
                    when the 10% validation reserve is available or paid.
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