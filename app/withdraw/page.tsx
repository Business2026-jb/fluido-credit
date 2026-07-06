"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/app/AppShell";

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

function cleanIbanValue(value: string) {
  return value.replace(/\s+/g, "").toUpperCase().trim();
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationEmail, setDestinationEmail] = useState("");
  const [destinationIban, setDestinationIban] = useState("");
  const [destinationBic, setDestinationBic] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCountry, setBankCountry] = useState("");
  const [description, setDescription] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);
  const fee = numericAmount > 0 ? 1.5 : 0;
  const totalDebited = numericAmount + fee;

  const cleanIban = useMemo(
    () => cleanIbanValue(destinationIban),
    [destinationIban]
  );

  async function submitWithdrawal(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (numericAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (!destinationName.trim()) {
      setError("Please enter the beneficiary name.");
      return;
    }

    if (!cleanIban) {
      setError("Please enter the beneficiary IBAN.");
      return;
    }

    if (!destinationBic.trim()) {
      setError("Please enter the beneficiary BIC / SWIFT.");
      return;
    }

    if (!bankName.trim()) {
      setError("Please enter the beneficiary bank name.");
      return;
    }

    if (!bankCountry.trim()) {
      setError("Please enter the beneficiary bank country.");
      return;
    }

    if (!accepted) {
      setError("Please confirm the withdrawal request before continuing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/withdraw/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          method: "External SEPA bank withdrawal",
          destinationName,
          destinationEmail,
          destinationIban: cleanIban,
          destinationBic,
          description: [
            description,
            bankName ? `Bank: ${bankName}` : "",
            bankCountry ? `Bank country: ${bankCountry}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to create withdrawal request.");
        return;
      }

      setMessage(`${data.message} Reference: ${data.reference}`);

      setAmount("");
      setDestinationName("");
      setDestinationEmail("");
      setDestinationIban("");
      setDestinationBic("");
      setBankName("");
      setBankCountry("");
      setDescription("");
      setAccepted(false);
    } catch {
      setError("Unable to create withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="w-full px-4 py-6 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06183A] via-[#062B8C] to-[#0B5FFF] p-6 text-white shadow-xl md:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-100">
                  External Bank Withdrawal
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  Withdraw to another bank
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
                  Send funds from your Fluido Credit account to an external
                  bank account. Your request is reviewed by our admin team
                  before final payout.
                </p>
              </div>

              <Link
                href="/transactions"
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-[#062B8C]"
              >
                View Transactions
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">Destination</p>
                <p className="mt-2 text-xl font-black">External Bank</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">Status</p>
                <p className="mt-2 text-xl font-black">Admin Review</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">Email</p>
                <p className="mt-2 text-xl font-black">Confirmation Sent</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <form
              onSubmit={submitWithdrawal}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
            >
              <h2 className="text-xl font-black text-[#06183A]">
                Beneficiary bank details
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in accurate bank information to help Fluido Credit validate
                and process your withdrawal securely.
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

              <div className="mt-6 rounded-[2rem] border border-[#062B8C] bg-blue-50 p-5">
                <p className="text-lg font-black text-[#06183A]">
                  External bank payout only
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  This page is dedicated to withdrawals toward external bank
                  accounts. Fluido-to-Fluido transfers are handled from the
                  Transfers page.
                </p>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Amount
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500.00"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-3xl font-black outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Beneficiary full name
                  </label>

                  <input
                    required
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    placeholder="John Smith"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Beneficiary email
                  </label>

                  <input
                    type="email"
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    placeholder="beneficiary@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Beneficiary IBAN
                </label>

                <input
                  required
                  value={destinationIban}
                  onChange={(e) => setDestinationIban(e.target.value)}
                  placeholder="FR76..."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none transition focus:border-[#062B8C] focus:bg-white"
                />

                <p className="mt-2 text-xs font-bold text-slate-400">
                  Clean IBAN: {cleanIban || "Not entered"}
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    BIC / SWIFT
                  </label>

                  <input
                    required
                    value={destinationBic}
                    onChange={(e) =>
                      setDestinationBic(e.target.value.toUpperCase())
                    }
                    placeholder="BNPAFRPPXXX"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Beneficiary bank name
                  </label>

                  <input
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="BNP Paribas"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Bank country
                </label>

                <input
                  required
                  value={bankCountry}
                  onChange={(e) => setBankCountry(e.target.value)}
                  placeholder="France"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Payment reference / reason
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Invoice payment, personal withdrawal, family support..."
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <label className="flex gap-3 text-sm font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1"
                  />

                  <span>
                    I confirm that the beneficiary bank details are correct and
                    I authorize Fluido Credit to submit this withdrawal for
                    admin review.
                  </span>
                </label>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="mt-6 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f66] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting withdrawal..." : "Submit Withdrawal"}
              </button>
            </form>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
                <p className="text-sm font-bold text-blue-100">
                  Withdrawal Summary
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-blue-100">Destination</p>
                    <p className="mt-1 text-xl font-black">
                      External bank account
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-blue-100">Amount</p>
                    <p className="mt-1 text-3xl font-black">
                      {formatEuro(numericAmount)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-blue-100">Fee</p>
                      <p className="mt-2 font-black">{formatEuro(fee)}</p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-blue-100">Total debited</p>
                      <p className="mt-2 font-black">
                        {formatEuro(totalDebited)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-blue-100">Processing</p>
                    <p className="mt-2 font-black">
                      Admin review before payout
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-blue-100">Bank</p>
                    <p className="mt-2 font-black">
                      {bankName || "Not entered"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Validation rules
                </h2>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p className="rounded-2xl bg-slate-50 p-4">
                    Withdrawals are reviewed by Fluido Credit admin before final
                    execution.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    The sender receives an email confirmation immediately after
                    submission.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    If a beneficiary email is provided, the beneficiary also
                    receives a processing notification.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    Failed or cancelled withdrawals are automatically refunded
                    to the sender account by admin action.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </AppShell>
  );
}