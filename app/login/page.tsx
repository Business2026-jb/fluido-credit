"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#06183A]">
      <section className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <aside className="relative hidden overflow-hidden bg-[#06183A] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_35%)]" />

          <Link href="/" className="relative z-10 flex items-center">
            <Image
              src="/alogo.png"
              alt="Fluido Credit"
              width={170}
              height={60}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="relative z-10 max-w-xl animate-[fadeUp_0.8s_ease-out]">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
              Secure customer access
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Access your Fluido Credit account securely.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Sign in to manage your account, loan applications, documents and
              banking activity.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "Encrypted account access",
                "Secure customer dashboard",
                "Loan application tracking",
                "Protected personal information",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition hover:bg-white/15"
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
            <p className="text-sm leading-6 text-blue-100">
              Never share your password or verification codes. Fluido Credit
              will never ask for your password by phone or email.
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-5 py-6">
          <div className="w-full max-w-md animate-[fadeUp_0.6s_ease-out]">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center">
                <Image
                  src="/alogo.png"
                  alt="Fluido Credit"
                  width={150}
                  height={52}
                  priority
                  className="h-11 w-auto object-contain"
                />
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-[#062B8C]"
              >
                Sign up
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-900/10 md:p-8">
              <div className="mb-7">
                <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
                  Secure login
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Access your secure Fluido Credit customer area.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Email address
                  </label>

                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-600">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-sm font-black text-[#062B8C]"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-700 focus-within:bg-white">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter your password"
                      className="w-full bg-transparent px-4 py-4 font-semibold outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-4 text-sm font-black text-blue-800"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f68] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">
                  New to Fluido Credit?
                </p>

                <Link
                  href="/register"
                  className="mt-1 inline-block text-sm font-black text-[#062B8C]"
                >
                  Create your secure account
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                Protected access. Your information is secured and used only for
                your Fluido Credit account.
              </p>
            </div>
          </div>
        </section>
      </section>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}