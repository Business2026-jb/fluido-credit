"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const countries = [
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
  { name: "Luxembourg", code: "LU", dial: "+352", flag: "🇱🇺" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
    password: "",
  });

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const found = countries.find((c) => c.code === data.country_code);
        if (found) setSelectedCountry(found);
      } catch {
        setSelectedCountry(countries[0]);
      } finally {
        setLoadingCountry(false);
      }
    }

    detectCountry();
  }, []);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;
    return score;
  }, [form.password]);

  const passwordLabel =
    passwordScore >= 4 ? "Strong" : passwordScore >= 2 ? "Medium" : "Weak";

  const handleChange = (field: string, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
        phone: `${selectedCountry.dial}${form.phone}`,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("fluido_register_email", data.email);
      window.location.href = "/verify-email";
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#06183A]">
      <section className="grid min-h-screen lg:grid-cols-[1fr_560px]">
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
              Secure digital banking experience
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Open your secure account in minutes.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Create your Fluido Credit profile, verify your email and start
              your loan application through a secure European-grade process.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "Encrypted registration flow",
                "Automatic country detection",
                "Email verification required",
                "GDPR-ready customer onboarding",
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
              Your information is used only to create your account, verify your
              identity and process your loan request securely.
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-5 py-6">
          <div className="w-full max-w-xl">
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

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 md:p-8">
              <div className="mb-6">
                <p className="text-sm font-black text-[#062B8C]">
                  Secure registration
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Create your account
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Complete your details to receive your verification code by email.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Full name
                  </label>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Smith"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Country
                  </label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = countries.find(
                        (c) => c.code === e.target.value
                      );
                      if (found) setSelectedCountry(found);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none transition focus:border-blue-700 focus:bg-white"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} {country.dial}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-slate-400">
                    {loadingCountry
                      ? "Detecting your country from your IP address..."
                      : "Country detected automatically. You can change it if needed."}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Phone number
                  </label>
                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-700 focus-within:bg-white">
                    <div className="flex items-center border-r border-slate-200 px-4 font-black">
                      {selectedCountry.flag} {selectedCountry.dial}
                    </div>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) =>
                        handleChange("phone", e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="612345678"
                      className="w-full bg-transparent px-4 py-4 font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-slate-600">
                      City
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Paris"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-600">
                      Postal code
                    </label>
                    <input
                      required
                      value={form.postalCode}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
                      placeholder="75001"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Address
                  </label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="12 Avenue de Paris"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-blue-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Password
                  </label>

                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-700 focus-within:bg-white">
                    <input
                      required
                      minLength={8}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        handleChange("password", e.target.value)
                      }
                      placeholder="Create a secure password"
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

                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className={`h-2 flex-1 rounded-full ${
                          passwordScore >= item
                            ? "bg-[#062B8C]"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Password strength:{" "}
                    <span className="font-black text-[#062B8C]">
                      {passwordLabel}
                    </span>
                  </p>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f68] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating secure account..." : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-black text-blue-800">
                  Log in
                </Link>
              </p>

              <p className="mt-5 text-center text-xs leading-6 text-slate-400">
                By creating an account, you agree to Fluido Credit Terms of Use,
                Privacy Policy and secure identity verification process.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}