"use client";

import Image from "next/image";
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
  { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Austria", code: "AT", dial: "+43", flag: "🇦🇹" },
  { name: "Denmark", code: "DK", dial: "+45", flag: "🇩🇰" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴" },
  { name: "Finland", code: "FI", dial: "+358", flag: "🇫🇮" },
  { name: "Poland", code: "PL", dial: "+48", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", dial: "+420", flag: "🇨🇿" },
  { name: "Slovakia", code: "SK", dial: "+421", flag: "🇸🇰" },
  { name: "Hungary", code: "HU", dial: "+36", flag: "🇭🇺" },
  { name: "Romania", code: "RO", dial: "+40", flag: "🇷🇴" },
  { name: "Bulgaria", code: "BG", dial: "+359", flag: "🇧🇬" },
  { name: "Croatia", code: "HR", dial: "+385", flag: "🇭🇷" },
  { name: "Slovenia", code: "SI", dial: "+386", flag: "🇸🇮" },
  { name: "Estonia", code: "EE", dial: "+372", flag: "🇪🇪" },
  { name: "Latvia", code: "LV", dial: "+371", flag: "🇱🇻" },
  { name: "Lithuania", code: "LT", dial: "+370", flag: "🇱🇹" },
  { name: "Greece", code: "GR", dial: "+30", flag: "🇬🇷" },
  { name: "Cyprus", code: "CY", dial: "+357", flag: "🇨🇾" },
  { name: "Malta", code: "MT", dial: "+356", flag: "🇲🇹" },
];

type EmailStatus = "idle" | "checking" | "available" | "taken";

export default function RegisterPage() {
  const [introLoading, setIntroLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [creatingStep, setCreatingStep] = useState("");

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
    const timer = setTimeout(() => {
      setIntroLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const detectedCountry = String(data.country_code || "").toUpperCase();
        const found = countries.find(
          (country) => country.code === detectedCountry
        );

        if (found) {
          setSelectedCountry(found);
        }
      } catch {
        setSelectedCountry(countries[0]);
      } finally {
        setLoadingCountry(false);
      }
    }

    detectCountry();
  }, []);

  useEffect(() => {
    const email = form.email.toLowerCase().trim();

    if (!email || !email.includes("@")) {
      setEmailStatus("idle");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setEmailStatus("checking");

        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          setEmailStatus("idle");
          return;
        }

        setEmailStatus(data.available ? "available" : "taken");
      } catch {
        setEmailStatus("idle");
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [form.email]);

  const passwordScore = useMemo(() => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (form.password.length >= 12) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    return Math.min(score, 5);
  }, [form.password]);

  const passwordLabel =
    passwordScore >= 5
      ? "Very strong"
      : passwordScore >= 4
      ? "Strong"
      : passwordScore >= 2
      ? "Medium"
      : "Weak";

  const handleChange = (field: string, value: string) => {
    setError("");
    setCreatingStep("");
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (introLoading) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-[#06183A]">
      <div className="flex flex-col items-center gap-5">
        <Image
          src="/alogo.png"
          alt="Fluido Credit"
          width={130}
          height={130}
          priority
          className="h-28 w-28 animate-spin object-contain"
        />

        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#062B8C]">
            Fluido Credit
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Preparing secure registration
          </p>
        </div>

        <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full animate-pulse rounded-full bg-[#062B8C]" />
        </div>
      </div>
    </main>
  );
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);
  setError("");
  setCreatingStep("");

  try {
    const normalizedEmail = form.email.toLowerCase().trim();
    const cleanPhone = form.phone.replace(/\D/g, "");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (emailStatus === "taken") {
      setError("This email is already registered.");
      setLoading(false);
      return;
    }

    if (cleanPhone.length < 6) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (!form.city.trim() || !form.address.trim() || !form.postalCode.trim()) {
      setError("Please complete your address information.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8 || passwordScore < 2) {
      setError("Please choose a stronger password.");
      setLoading(false);
      return;
    }

    setCreatingStep("Creating secure customer profile...");

    const payload = {
      ...form,
      email: normalizedEmail,
      phone: `${selectedCountry.dial}${cleanPhone}`,
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed.");
      setCreatingStep("");
      setLoading(false);
      return;
    }

    localStorage.setItem("fluido_register_email", data.email);

    setTimeout(() => {
      setCreatingStep("Sending verification email...");
    }, 600);

    setTimeout(() => {
      setCreatingStep("Redirecting to email verification...");
    }, 1300);

    setTimeout(() => {
      window.location.href = "https://fluidocredit.com/verify-email";
    }, 2200);
  } catch {
    setError("Unable to create your account. Please try again.");
    setCreatingStep("");
    setLoading(false);
  }
};
return (
  <main className="min-h-screen bg-[#F5F7FB] text-[#06183A]">
    <section className="grid min-h-screen lg:grid-cols-[1fr_600px]">
      <aside className="relative hidden overflow-hidden bg-[#06183A] text-white lg:block">
        <Image
          src="/imagefluido.jpeg"
          alt="Fluido Credit"
          width={1200}
          height={1200}
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#06183A] via-[#06183A]/90 to-[#062B8C]/80" />

        <div className="relative z-10 flex min-h-screen flex-col justify-between px-12 py-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/alogo.png"
              alt="Fluido Credit"
              width={170}
              height={60}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-blue-100 backdrop-blur">
              Secure European banking
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Open your Fluido Credit account.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              Create your secure account and access your Fluido banking space in
              minutes.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                "Secure email verification",
                "Protected customer profile",
                "Instant access after approval",
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

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm leading-6 text-blue-100">
              Fluido Credit protects your information and uses it only for
              account opening, identity verification and financial services.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-4 py-6 md:px-6">
        <div className="w-full max-w-xl">
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
              href="/login"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#062B8C]"
            >
              Log in
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 md:p-8">
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
                Secure account opening
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your country code is detected automatically. You can change it
                anytime.
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
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="John Smith"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div>
                    <label className="text-sm font-bold text-slate-600">
                  Email address
                </label>

                <input
                  required
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />

                {emailStatus !== "idle" && (
                  <p className="mt-2 text-xs font-bold">
                    {emailStatus === "checking" && (
                      <span className="text-slate-400">
                        Checking email...
                      </span>
                    )}

                    {emailStatus === "available" && (
                      <span className="text-emerald-600">
                        Email available
                      </span>
                    )}

                    {emailStatus === "taken" && (
                      <span className="text-red-600">
                        Email already registered
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Country
                </label>

                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = countries.find(
                      (country) => country.code === e.target.value
                    );

                    if (found) {
                      setSelectedCountry(found);
                    }
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none transition focus:border-[#062B8C] focus:bg-white"
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
                    : `Selected country: ${selectedCountry.name} ${selectedCountry.dial}`}
                </p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Phone number
                </label>

                <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#062B8C] focus-within:bg-white">
                  <div className="flex min-w-[118px] items-center justify-center border-r border-slate-200 px-4 font-black">
                    {selectedCountry.flag} {selectedCountry.dial}
                  </div>

                  <input
                    required
                    inputMode="numeric"
                    autoComplete="tel-national"
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
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Paris"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Postal code
                  </label>

                  <input
                    required
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={(e) =>
                      handleChange("postalCode", e.target.value)
                    }
                    placeholder="75001"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Address
                </label>

                <input
                  required
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="12 Avenue de Paris"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Password
                </label>

                <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#062B8C] focus-within:bg-white">
                  <input
                    required
                    minLength={8}
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Create a secure password"
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

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`h-2 flex-1 rounded-full transition ${
                        passwordScore >= item ? "bg-[#062B8C]" : "bg-slate-200"
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

              {creatingStep && (
                <div className="rounded-2xl bg-blue-50 p-4 text-sm font-bold text-[#062B8C]">
                  {creatingStep}
                </div>
              )}

              <button
                disabled={loading || emailStatus === "taken"}
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f68] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Creating your account..."
                  : "Create my secure account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-black text-[#062B8C]">
                Log in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-6 text-slate-400">
              By creating an account, you agree to Fluido Credit{" "}
              <Link href="/terms" className="font-bold text-slate-500">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-bold text-slate-500">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </section>
  </main>
);
}