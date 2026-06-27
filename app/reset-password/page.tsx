"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("fluido_reset_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      localStorage.removeItem("fluido_reset_email");
      window.location.href = "/login";
    } catch {
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#06183A]">
      <section className="flex min-h-screen items-center justify-center px-5 py-6">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-900/10 md:p-8">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-emerald-500 to-yellow-400">
              <span className="text-2xl font-black text-white">F</span>
            </div>
            <span className="text-2xl font-black">
              Fluido<span className="font-medium text-slate-600">Credit</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter the 6-digit code sent to your email and choose a new secure password.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="mt-7 space-y-5">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-blue-700"
            />

            <input
              required
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-blue-700"
            />

            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-700">
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full bg-transparent px-4 py-4 font-semibold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-sm font-black text-[#062B8C]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              disabled={loading || code.length !== 6}
              type="submit"
              className="w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-70"
            >
              {loading ? "Updating password..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Back to{" "}
            <Link href="/login" className="font-black text-[#062B8C]">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}