"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to send reset code.");
        return;
      }

      localStorage.setItem("fluido_reset_email", email);
      setMessage("If this email exists, a secure reset code has been sent.");

      setTimeout(() => {
        window.location.href = "/reset-password";
      }, 1200);
    } catch {
      setError("Unable to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#06183A]">
      <section className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <aside className="relative hidden overflow-hidden bg-[#06183A] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-emerald-500 to-yellow-400">
              <span className="text-2xl font-black text-white">F</span>
            </div>
            <span className="text-3xl font-black">
              Fluido<span className="font-medium text-blue-100">Credit</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
              Secure password recovery
            </p>
            <h1 className="text-5xl font-black leading-tight">
              Recover access to your account securely.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Enter your email address and we will send you a secure verification code.
            </p>
          </div>

          <p className="relative z-10 text-sm text-blue-100">
            Never share your password or security codes with anyone.
          </p>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-5 py-6">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-900/10 md:p-8">
            <h1 className="text-3xl font-black">Forgot password?</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your email address to receive a secure reset code.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Email address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-blue-700 focus:bg-white"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-70"
              >
                {loading ? "Sending secure code..." : "Send reset code"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link href="/login" className="font-black text-[#062B8C]">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}