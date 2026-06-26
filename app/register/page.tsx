"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const countries = [
  { name: "France", code: "FR", dial: "+33" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Luxembourg", code: "LU", dial: "+352" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [loadingCountry, setLoadingCountry] = useState(true);

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

  const passwordStrength = useMemo(() => {
    if (form.password.length >= 10) return "Strong";
    if (form.password.length >= 6) return "Medium";
    return "Weak";
  }, [form.password]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      phoneCode: selectedCountry.dial,
      fullPhone: `${selectedCountry.dial}${form.phone}`,
    };

    console.log("REGISTER PAYLOAD:", payload);

    // Plus tard ici :
    // 1. Enregistrer le client en base de données
    // 2. Envoyer le code par mail depuis noreply@fluidocredit.com
    // 3. Rediriger vers la page de vérification

    localStorage.setItem("fluido_register_email", form.email);

    window.location.href = "/verify-email";
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

          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black hover:bg-slate-50"
          >
            Log in
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <p className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
            Secure European loan application
          </p>

          <h1 className="max-w-xl text-5xl font-black leading-tight">
            Create your account and start your loan request securely.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Fluido Credit helps you apply online with a simple, secure and professional process adapted for customers in Europe.
          </p>

          <div className="mt-8 grid max-w-lg gap-4">
            {[
              "Automatic country detection",
              "Email verification code",
              "Secure customer profile",
              "GDPR-ready registration flow",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                  ✓
                </span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-900/10 md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Start your secure loan application in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600">Full name</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="John Smith"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Email address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Country</label>
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const found = countries.find((c) => c.code === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-blue-700"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} {country.dial}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate-400">
                {loadingCountry
                  ? "Detecting your country..."
                  : "Country detected automatically. You can change it if needed."}
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Phone number</label>
              <div className="mt-2 flex rounded-xl border border-slate-200 focus-within:border-blue-700">
                <div className="flex items-center border-r border-slate-200 px-4 font-black">
                  {selectedCountry.dial}
                </div>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="612345678"
                  className="w-full rounded-r-xl px-4 py-4 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">City</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Paris"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">Postal code</label>
                <input
                  required
                  value={form.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="75001"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Address</label>
              <input
                required
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="12 Avenue de Paris"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Password</label>
              <div className="mt-2 flex rounded-xl border border-slate-200 focus-within:border-blue-700">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full rounded-l-xl px-4 py-4 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-sm font-black text-blue-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Password strength:{" "}
                <span className="font-bold text-[#062B8C]">{passwordStrength}</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 hover:bg-[#041f68]"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-black text-blue-800">
              Log in
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-6 text-slate-400">
            By creating an account, you agree to Fluido Credit Terms of Use and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}