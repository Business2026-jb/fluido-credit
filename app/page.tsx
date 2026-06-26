"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const partners = [
  "BNP Paribas",
  "Santander",
  "ING",
  "Deutsche Bank",
  "UniCredit",
  "Crédit Agricole",
  "BBVA",
  "Societe Generale",
];

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);

export default function HomePage() {
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(60);

  const annualRate = 6.9;

  const monthlyPayment = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const payment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

    return payment;
  }, [amount, term]);

  const totalDue = monthlyPayment * term;
  const totalInterest = totalDue - amount;

  return (
    <main className="min-h-screen bg-white text-[#06183A]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-emerald-500 to-yellow-400 shadow-sm">
              <span className="text-xl font-black text-white">F</span>
            </div>
            <span className="text-2xl font-black tracking-tight">
              Fluido<span className="font-medium text-slate-600">Credit</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm font-semibold text-slate-600 hover:text-blue-800">
              How it works
            </a>
            <a href="#partners" className="text-sm font-semibold text-slate-600 hover:text-blue-800">
              Partners
            </a>
            <a href="#security" className="text-sm font-semibold text-slate-600 hover:text-blue-800">
              Security
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold hover:bg-slate-50">
              Log in
            </Link>
            <Link href="/register" className="rounded-xl bg-[#062B8C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#041f68]">
              Sign up
            </Link>
          </div>

          <button className="md:hidden rounded-xl border border-slate-300 p-3">
            <span className="block h-0.5 w-6 bg-[#06183A]" />
            <span className="mt-1.5 block h-0.5 w-6 bg-[#06183A]" />
            <span className="mt-1.5 block h-0.5 w-6 bg-[#06183A]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 pb-4 md:hidden">
          <Link href="/login" className="rounded-xl border border-slate-300 py-3 text-center text-sm font-bold">
            Log in
          </Link>
          <Link href="/register" className="rounded-xl bg-[#062B8C] py-3 text-center text-sm font-bold text-white">
            Sign up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-white via-[#F5F9FF] to-[#EAF3FF]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              Secure • Fast • Transparent
            </p>

            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Get the loan you need, simply and securely
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Fluido Credit helps customers in Europe compare, simulate and request personal loans online with a clear and professional process.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="rounded-xl bg-[#062B8C] px-7 py-4 text-center font-black text-white shadow-xl shadow-blue-900/20 hover:bg-[#041f68]">
                Get started
              </Link>
              <a href="#simulator" className="rounded-xl border border-blue-700 px-7 py-4 text-center font-black text-blue-800 hover:bg-blue-50">
                Simulate my loan
              </a>
            </div>
          </div>

          {/* REAL SIMULATOR */}
          <div id="simulator" className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-900/15">
            <div className="mb-5 h-1 w-16 rounded-full bg-blue-700" />

            <div className="mb-5">
              <label className="text-sm font-semibold text-slate-500">Loan amount</label>
              <div className="mt-2 flex items-center rounded-xl border border-slate-200 px-4 py-3">
                <span className="mr-2 text-xl font-black">€</span>
                <input
                  type="number"
                  min={1000}
                  max={50000}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-transparent text-3xl font-black outline-none"
                />
              </div>

              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-4 w-full accent-[#062B8C]"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>€1,000</span>
                <span>€50,000</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-semibold text-slate-500">Loan term</label>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg font-black outline-none"
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

            <div className="grid gap-3 rounded-2xl bg-[#F5F9FF] p-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Estimated monthly payment</span>
                <strong>{formatEuro(monthlyPayment)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Estimated interest</span>
                <strong>{formatEuro(totalInterest)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total amount due</span>
                <strong>{formatEuro(totalDue)}</strong>
              </div>
            </div>

            <Link href="/register" className="mt-5 block rounded-xl bg-[#062B8C] py-4 text-center font-black text-white hover:bg-[#041f68]">
              Continue application
            </Link>

            <p className="mt-3 text-center text-xs text-slate-400">
              Simulation only. Final offer depends on eligibility and verification.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
          {[
            ["⚡", "Quick approval", "Get a response in minutes"],
            ["🛡️", "Secure & reliable", "Your data is protected"],
            ["🇪🇺", "European standards", "Built for EU customers"],
          ].map((item) => (
            <div key={item[1]} className="flex items-center gap-4 rounded-xl p-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                {item[0]}
              </div>
              <div>
                <h3 className="font-black">{item[1]}</h3>
                <p className="text-sm text-slate-500">{item[2]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="mx-auto max-w-7xl px-5 py-8">
        <div className="rounded-3xl bg-[#06183A] p-6 text-white md:p-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-blue-200">European banking network</p>
              <h2 className="mt-2 text-3xl font-black">Partner banks across Europe</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-blue-100">
              Fluido Credit is designed to connect customers with trusted financial institutions and lending partners.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {partners.map((bank) => (
              <div key={bank} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center text-sm font-black backdrop-blur">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-10">
        <h2 className="text-center text-3xl font-black">How it works</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Apply online", "Complete your request in a few minutes."],
            ["2", "Verify your profile", "Upload your required documents securely."],
            ["3", "Receive a decision", "Get an answer and continue your application."],
          ].map((step) => (
            <div key={step[0]} className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-black text-blue-800">
                {step[0]}
              </div>
              <h3 className="mt-5 text-xl font-black">{step[1]}</h3>
              <p className="mt-3 text-slate-500">{step[2]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#F7FAFF] py-12">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center text-3xl font-black">Why choose Fluido Credit?</h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["%", "Competitive rates", "Transparent estimated rates"],
              ["📅", "Flexible terms", "Choose a repayment period"],
              ["🔒", "100% online", "No branch visit required"],
              ["🎧", "Dedicated support", "Professional customer assistance"],
            ].map((benefit) => (
              <div key={benefit[1]} className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl font-black text-blue-800">
                  {benefit[0]}
                </div>
                <h3 className="mt-5 text-lg font-black">{benefit[1]}</h3>
                <p className="mt-3 text-sm text-slate-500">{benefit[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black">Your security is our priority</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["GDPR Compliant", "Bank-level Security", "SSL Encrypted", "Identity Verification"].map((text) => (
              <div key={text} className="rounded-xl bg-slate-50 p-5 font-black">
                🛡️ {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#062B8C] p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black">Ready to start your application?</h2>
            <p className="mt-3 text-blue-100">
              Create your account and continue your loan request securely.
            </p>
          </div>

          <Link href="/register" className="rounded-xl bg-white px-7 py-4 font-black text-[#062B8C]">
            Sign up now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06183A] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-black">
              Fluido<span className="font-medium text-blue-200">Credit</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-blue-100">
              Smart loans for your projects, with transparency and trust.
            </p>
          </div>

          <div>
            <h3 className="font-black">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li>About us</li>
              <li>How it works</li>
              <li>Partners</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li>FAQ</li>
              <li>Loan guide</li>
              <li>Support</li>
              <li>Security</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li>Terms of use</li>
              <li>Privacy policy</li>
              <li>Cookies policy</li>
              <li>GDPR</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-blue-100">
          © 2026 Fluido Credit. All rights reserved.
        </div>
      </footer>
    </main>
  );
}