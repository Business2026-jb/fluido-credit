"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(60);

  const annualRate = 6.9;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }, [amount, term]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/alogo.png"
            alt="Fluido Credit"
            width={120}
            height={120}
            priority
            className="h-24 w-24 animate-spin object-contain"
          />
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#062B8C]">
            Fluido Credit
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#06183A]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/alogo.png"
              alt="Fluido Credit"
              width={150}
              height={50}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#services" className="text-sm font-bold text-slate-600 hover:text-[#062B8C]">
              Services
            </a>
            <a href="#security" className="text-sm font-bold text-slate-600 hover:text-[#062B8C]">
              Security
            </a>
            <a href="#loan" className="text-sm font-bold text-slate-600 hover:text-[#062B8C]">
              Simulator
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-[#06183A]"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="hidden rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 md:block"
            >
              Open account
            </Link>
          </div>
        </div>
      </header>

      <section className="w-full px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
            <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-[#062B8C]">
              European digital banking
            </p>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Banking, loans and payments in one secure account.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
              Manage your Fluido Credit account, request financing, receive deposits and send money securely.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-[#062B8C] px-7 py-4 text-center font-black text-white shadow-xl shadow-blue-900/20"
              >
                Open account
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-center font-black text-[#06183A]"
              >
                Access my account
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Instant", "Fluido transfers"],
                ["Secure", "KYC verification"],
                ["24/7", "Account access"],
              ].map((item) => (
                <div key={item[0]} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-2xl font-black text-[#062B8C]">{item[0]}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{item[1]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#06183A] shadow-2xl">
            <Image
              src="/imagefluido.jpeg"
              alt="Fluido Credit banking"
              width={900}
              height={800}
              priority
              className="h-[520px] w-full object-cover opacity-80"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#06183A] via-[#06183A]/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
              <p className="text-sm font-bold text-blue-100">Private digital account</p>
              <h2 className="mt-2 text-3xl font-black">
                Simple. Secure. Fast.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="w-full px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-4">
          {[
            ["Account", "Manage your balance and activity."],
            ["Loans", "Request financing online."],
            ["Transfers", "Send money to Fluido accounts."],
            ["Deposits", "Add funds by USDT or bank transfer."],
          ].map((service) => (
            <div key={service[0]} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-[#06183A]">{service[0]}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{service[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="loan" className="w-full px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[1fr_430px]">
          <div className="rounded-[2rem] bg-[#06183A] p-6 text-white md:p-8">
            <p className="text-sm font-black uppercase tracking-widest text-blue-100">
              Loan simulator
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Estimate your monthly payment.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
              Choose an amount and duration. Final approval depends on eligibility and verification.
            </p>

            <Link
              href="/loans/apply"
              className="mt-8 inline-block rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#062B8C]"
            >
              Apply for a loan
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-sm font-bold text-slate-500">
              Loan amount
            </label>

            <input
              type="number"
              min={1000}
              max={50000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-3xl font-black outline-none focus:border-[#062B8C] focus:bg-white"
            />

            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-5 w-full accent-[#062B8C]"
            />

            <label className="mt-6 block text-sm font-bold text-slate-500">
              Duration
            </label>

            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-black outline-none"
            >
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
              <option value={72}>72 months</option>
              <option value={84}>84 months</option>
            </select>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-bold text-slate-500">Estimated monthly payment</p>
              <p className="mt-2 text-4xl font-black text-[#062B8C]">
                {formatEuro(monthlyPayment)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Estimated rate: {annualRate}% yearly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="w-full px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-3">
          {[
            ["Protected access", "Secure login and verified customer accounts."],
            ["Document verification", "KYC documents reviewed by compliance."],
            ["Transaction monitoring", "Deposits, withdrawals and transfers are tracked."],
          ].map((item) => (
            <div key={item[0]} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">{item[0]}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 rounded-[2rem] bg-[#062B8C] p-6 text-white md:flex-row md:items-center md:p-8">
          <div>
            <h2 className="text-3xl font-black">Ready to start?</h2>
            <p className="mt-2 text-blue-100">
              Open your Fluido Credit account in a few minutes.
            </p>
          </div>

          <Link
            href="/register"
            className="rounded-2xl bg-white px-7 py-4 text-center font-black text-[#062B8C]"
          >
            Create account
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:px-8">
          <p>© 2019-2026 Fluido Credit. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}