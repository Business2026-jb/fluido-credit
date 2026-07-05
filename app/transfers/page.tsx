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

export default function TransfersPage() {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [beneficiaryIban, setBeneficiaryIban] = useState("");
  const [beneficiaryBic, setBeneficiaryBic] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);

  const cleanIban = useMemo(
    () => beneficiaryIban.replace(/\s+/g, "").toUpperCase(),
    [beneficiaryIban]
  );

  async function submitTransfer(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (numericAmount <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }

    if (!accepted) {
      setError("Please confirm the transfer before continuing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/transfers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beneficiaryName,
          beneficiaryEmail,
          beneficiaryIban: cleanIban,
          beneficiaryBic,
          amount: numericAmount,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to create transfer.");
        return;
      }

      setMessage(`${data.message} Reference: ${data.reference}`);

      setBeneficiaryName("");
      setBeneficiaryEmail("");
      setBeneficiaryIban("");
      setBeneficiaryBic("");
      setAmount("");
      setDescription("");
      setAccepted(false);
    } catch {
      setError("Unable to create transfer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Secure Transfers
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Send Money
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Send funds securely to another Fluido Credit account or to an
              external bank account.
            </p>
          </div>

          <Link
            href="/transactions"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-[#06183A]"
          >
            View Transactions
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <form
            onSubmit={submitTransfer}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
          >
            <h2 className="text-xl font-black text-[#06183A]">
              Transfer Details
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter the beneficiary details carefully before confirming.
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Beneficiary name
                </label>

                <input
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="John Smith"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>

              <div>
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
                  placeholder="250.00"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Beneficiary email
              </label>

              <input
                type="email"
                value={beneficiaryEmail}
                onChange={(e) => setBeneficiaryEmail(e.target.value)}
                placeholder="beneficiary@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
              />

              <p className="mt-2 text-xs text-slate-400">
                Optional. If provided, the beneficiary will receive a transfer
                confirmation email.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">IBAN</label>

              <input
                required
                value={beneficiaryIban}
                onChange={(e) => setBeneficiaryIban(e.target.value)}
                placeholder="FR76..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none"
              />

              <p className="mt-2 text-xs font-bold text-slate-400">
                Clean IBAN: {cleanIban || "Not entered"}
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                BIC / SWIFT
              </label>

              <input
                value={beneficiaryBic}
                onChange={(e) => setBeneficiaryBic(e.target.value)}
                placeholder="Optional for internal Fluido transfers"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Payment reference / reason
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rent payment, invoice, family support..."
                className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
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
                  I confirm that the beneficiary details are correct and I
                  authorize Fluido Credit to execute this transfer.
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-70"
            >
              {loading ? "Processing transfer..." : "Confirm Transfer"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Transfer Summary</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-blue-100">Amount</p>
                  <p className="mt-1 text-3xl font-black">
                    {formatEuro(numericAmount)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Beneficiary</p>
                  <p className="mt-2 font-black">
                    {beneficiaryName || "Not entered"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Processing</p>
                  <p className="mt-2 font-black">
                    Internal instant / External review
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Transfer Types
              </h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="font-black text-[#06183A]">
                    Internal Fluido transfer
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Completed instantly when the IBAN belongs to another Fluido
                    account.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-[#06183A]">
                    External bank transfer
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Created with PROCESSING status for later bank provider
                    execution.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}