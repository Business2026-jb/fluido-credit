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

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [transferType, setTransferType] = useState<"FLUIDO" | "BANK">("BANK");
  const [destinationName, setDestinationName] = useState("");
  const [destinationEmail, setDestinationEmail] = useState("");
  const [destinationIban, setDestinationIban] = useState("");
  const [destinationBic, setDestinationBic] = useState("");
  const [description, setDescription] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);

  const fee = useMemo(() => {
    if (!numericAmount) return 0;
    return transferType === "FLUIDO" ? 0 : 1.5;
  }, [numericAmount, transferType]);

  const totalDebited = numericAmount + fee;

  const method =
    transferType === "FLUIDO"
      ? "Fluido Credit internal transfer"
      : "SEPA bank transfer";

  async function submitWithdrawal(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (numericAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
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
          method,
          destinationName,
          destinationEmail,
          destinationIban,
          destinationBic,
          description,
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
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
              Secure Withdrawal
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Withdraw Funds
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Transfer available funds to another Fluido Credit account or to an
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
            onSubmit={submitWithdrawal}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
          >
            <h2 className="text-xl font-black text-[#06183A]">
              Withdrawal Details
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose where you want to send your funds.
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

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setTransferType("FLUIDO")}
                className={`rounded-[2rem] border p-5 text-left transition ${
                  transferType === "FLUIDO"
                    ? "border-[#062B8C] bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-black text-[#06183A]">
                  Fluido Credit Account
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Transfer to another Fluido Credit customer.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTransferType("BANK")}
                className={`rounded-[2rem] border p-5 text-left transition ${
                  transferType === "BANK"
                    ? "border-[#062B8C] bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-black text-[#06183A]">
                  External Bank
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Send money to a SEPA bank account.
                </p>
              </button>
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
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-3xl font-black outline-none"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Beneficiary name
              </label>

              <input
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder={
                  transferType === "FLUIDO"
                    ? "Fluido customer full name"
                    : "Bank account holder name"
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Beneficiary email
              </label>

              <input
                type="email"
                value={destinationEmail}
                onChange={(e) => setDestinationEmail(e.target.value)}
                placeholder="beneficiary@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none"
              />

              <p className="mt-2 text-xs text-slate-400">
                Optional. If provided, the beneficiary will receive a
                confirmation email.
              </p>
            </div>

            {transferType === "FLUIDO" ? (
              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Fluido Credit IBAN or customer account reference
                </label>

                <input
                  required
                  value={destinationIban}
                  onChange={(e) =>
                    setDestinationIban(e.target.value.toUpperCase())
                  }
                  placeholder="FR76..."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none"
                />
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <label className="text-sm font-bold text-slate-600">
                    Beneficiary IBAN
                  </label>

                  <input
                    required
                    value={destinationIban}
                    onChange={(e) =>
                      setDestinationIban(e.target.value.toUpperCase())
                    }
                    placeholder="FR76..."
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="text-sm font-bold text-slate-600">
                    Beneficiary BIC / SWIFT
                  </label>

                  <input
                    value={destinationBic}
                    onChange={(e) =>
                      setDestinationBic(e.target.value.toUpperCase())
                    }
                    placeholder="Optional"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none"
                  />
                </div>
              </>
            )}

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Transfer reason..."
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
                  authorize Fluido Credit to process this withdrawal.
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-70"
            >
              {loading ? "Processing withdrawal..." : "Confirm Withdrawal"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <p className="text-sm font-bold text-blue-100">
                Withdrawal summary
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-blue-100">Destination</p>
                  <p className="mt-1 text-xl font-black">
                    {transferType === "FLUIDO"
                      ? "Fluido Credit account"
                      : "External bank account"}
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
                    {transferType === "FLUIDO"
                      ? "Instant internal review"
                      : "SEPA payout review"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                Security checks
              </h2>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="rounded-2xl bg-slate-50 p-4">
                  The requested amount must be available in your account before
                  processing.
                </p>

                <p className="rounded-2xl bg-slate-50 p-4">
                  External bank transfers may require manual compliance review.
                </p>

                <p className="rounded-2xl bg-slate-50 p-4">
                  Beneficiary details must match the account owner information.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}