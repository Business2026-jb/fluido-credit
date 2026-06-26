"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("fluido_register_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // Plus tard ici :
    // Vérifier le code reçu par mail depuis la base de données.

    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#F5F9FF] to-[#EAF3FF] text-[#06183A]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-emerald-500 to-yellow-400">
              <span className="text-xl font-black text-white">F</span>
            </div>
            <span className="text-2xl font-black">
              Fluido<span className="font-medium text-slate-600">Credit</span>
            </span>
          </Link>

          <Link href="/login" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black">
            Log in
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-blue-900/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
            ✉️
          </div>

          <h1 className="mt-6 text-3xl font-black">Verify your email</h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We sent a verification code to{" "}
            <span className="font-bold text-[#06183A]">{email || "your email address"}</span>.
          </p>

          <form onSubmit={handleVerify} className="mt-8 space-y-5">
            <input
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full rounded-xl border border-slate-200 px-4 py-4 text-center text-2xl font-black tracking-[0.4em] outline-none focus:border-blue-700"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[#062B8C] py-4 font-black text-white hover:bg-[#041f68]"
            >
              Verify account
            </button>
          </form>

          <button className="mt-5 text-sm font-black text-blue-800">
            Resend code
          </button>

          <p className="mt-6 text-xs leading-6 text-slate-400">
            The verification code is sent from noreply@fluidocredit.com.
          </p>
        </div>
      </section>
    </main>
  );
}