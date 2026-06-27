"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    const savedEmail = localStorage.getItem("fluido_register_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid verification code.");
        return;
      }

      localStorage.removeItem("fluido_register_email");
      setSuccess("Your account has been verified successfully.");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch {
      setError("Unable to verify your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (counter > 0 || !email) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to resend code.");
        return;
      }

      setSuccess("A new verification code has been sent.");
      setCounter(60);
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#06183A]">
      <section className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <aside className="relative hidden overflow-hidden bg-[#06183A] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-emerald-500 to-yellow-400 shadow-lg">
              <span className="text-2xl font-black text-white">F</span>
            </div>
            <span className="text-3xl font-black">
              Fluido<span className="font-medium text-blue-100">Credit</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
              Email security verification
            </p>

            <h1 className="text-5xl font-black leading-tight">
              One final step to protect your account.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Enter the 6-digit verification code sent to your email address to
              activate your Fluido Credit account securely.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "6-digit secure verification code",
                "Code expires after 10 minutes",
                "New code available after 60 seconds",
                "Welcome confirmation after activation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-[#06183A]">
                    ✓
                  </span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">
              For your security, never share your verification code with anyone.
              Fluido Credit will never ask for this code by phone.
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-5 py-6">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-emerald-500 to-yellow-400">
                  <span className="text-xl font-black text-white">F</span>
                </div>
                <span className="text-2xl font-black">
                  Fluido<span className="font-medium text-slate-600">Credit</span>
                </span>
              </Link>

              <Link href="/login" className="text-sm font-black text-[#062B8C]">
                Log in
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-2xl shadow-blue-900/10 md:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                ✉️
              </div>

              <p className="mt-6 text-sm font-black text-[#062B8C]">
                Secure verification
              </p>

              <h1 className="mt-2 text-3xl font-black">Verify your email</h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter the 6-digit code sent to{" "}
                <span className="font-black text-[#06183A]">
                  {email || "your email address"}
                </span>
                .
              </p>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleVerify} className="mt-7 space-y-5">
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-3xl font-black tracking-[0.45em] outline-none transition focus:border-blue-700 focus:bg-white"
                />

                <button
                  disabled={loading || code.length !== 6}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f68] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying account..." : "Verify account"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Didn&apos;t receive the code?
                </p>

                <button
                  onClick={handleResend}
                  disabled={counter > 0 || resending}
                  className="mt-2 text-sm font-black text-[#062B8C] disabled:text-slate-400"
                >
                  {resending
                    ? "Sending new code..."
                    : counter > 0
                    ? `Resend code in ${counter}s`
                    : "Resend code"}
                </button>
              </div>

              <p className="mt-6 text-xs leading-6 text-slate-400">
                This step helps us protect your account and prevent unauthorized access.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}