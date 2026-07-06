"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/app/AppShell";

type IbanResolution = {
  found: boolean;
  type: "FLUIDO" | "EXTERNAL";
  beneficiaryName?: string;
  maskedEmail?: string;
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

function cleanIbanValue(value: string) {
  return value.replace(/\s+/g, "").toUpperCase().trim();
}

export default function TransfersPage() {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryIban, setBeneficiaryIban] = useState("");
  const [beneficiaryBic, setBeneficiaryBic] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [ibanStatus, setIbanStatus] = useState<IbanResolution | null>(null);
  const [checkingIban, setCheckingIban] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);

  const cleanIban = useMemo(
    () => cleanIbanValue(beneficiaryIban),
    [beneficiaryIban]
  );

  const transferType = ibanStatus?.found ? "FLUIDO" : "BANK";

  useEffect(() => {
    async function resolveIban() {
      setIbanStatus(null);

      if (cleanIban.length < 12) return;

      setCheckingIban(true);

      try {
        const res = await fetch("/api/accounts/resolve-iban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iban: cleanIban }),
        });

        const data = await res.json();

        if (res.ok) {
          setIbanStatus(data);

          if (data.found && data.beneficiaryName) {
            setBeneficiaryName(data.beneficiaryName);
          }
        }
      } catch {
        setIbanStatus(null);
      } finally {
        setCheckingIban(false);
      }
    }

    const timer = setTimeout(resolveIban, 600);
    return () => clearTimeout(timer);
  }, [cleanIban]);

  async function submitTransfer(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (numericAmount <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }

    if (!beneficiaryName.trim()) {
      setError("Please enter the beneficiary name.");
      return;
    }

    if (!cleanIban) {
      setError("Please enter the beneficiary IBAN.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiaryName,
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
      setBeneficiaryIban("");
      setBeneficiaryBic("");
      setAmount("");
      setDescription("");
      setAccepted(false);
      setIbanStatus(null);
    } catch {
      setError("Unable to create transfer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06183A] via-[#062B8C] to-[#0B5FFF] p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-blue-100">
                Secure Transfers
              </p>

              <h1 className="mt-3 text-3xl font-black md:text-5xl">
                Send Money
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Send funds securely to another Fluido Credit account or to an
                external bank beneficiary.
              </p>
            </div>

            <Link
              href="/transactions"
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-[#062B8C]"
            >
              View Transactions
            </Link>
          </div>
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
              Enter the beneficiary IBAN. If it belongs to a Fluido Credit
              customer, the beneficiary is detected automatically.
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
              <div
                className={`rounded-[2rem] border p-5 ${
                  transferType === "FLUIDO"
                    ? "border-[#062B8C] bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-black text-[#06183A]">
                  Internal Fluido
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Completed instantly when the IBAN belongs to Fluido Credit.
                </p>
              </div>

              <div
                className={`rounded-[2rem] border p-5 ${
                  transferType === "BANK"
                    ? "border-[#062B8C] bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-black text-[#06183A]">
                  External Bank
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Processed securely after review.
                </p>
              </div>
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
                placeholder="250.00"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-3xl font-black outline-none transition focus:border-[#062B8C] focus:bg-white"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Beneficiary IBAN
              </label>

              <input
                required
                value={beneficiaryIban}
                onChange={(e) => setBeneficiaryIban(e.target.value)}
                placeholder="FR76..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none transition focus:border-[#062B8C] focus:bg-white"
              />

              <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm">
                {checkingIban ? (
                  <p className="font-bold text-slate-500">
                    Checking IBAN...
                  </p>
                ) : ibanStatus?.found ? (
                  <div>
                    <p className="font-black text-emerald-700">
                      Fluido Credit beneficiary detected
                    </p>
                    <p className="mt-1 text-slate-500">
                      {ibanStatus.beneficiaryName} · {ibanStatus.maskedEmail}
                    </p>
                  </div>
                ) : cleanIban ? (
                  <p className="font-bold text-slate-500">
                    External bank beneficiary
                  </p>
                ) : (
                  <p className="font-bold text-slate-400">
                    Enter an IBAN to verify the beneficiary.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Beneficiary name
                </label>

                <input
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Beneficiary full name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  BIC / SWIFT
                </label>

                <input
                  value={beneficiaryBic}
                  onChange={(e) =>
                    setBeneficiaryBic(e.target.value.toUpperCase())
                  }
                  placeholder="Optional"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold uppercase outline-none transition focus:border-[#062B8C] focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-600">
                Payment reference / reason
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rent payment, invoice, family support..."
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
                  I confirm that the beneficiary details are correct and I
                  authorize Fluido Credit to execute this transfer.
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f66] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Processing transfer..." : "Confirm Transfer"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <p className="text-sm font-bold text-blue-100">
                Transfer Summary
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

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Beneficiary</p>
                  <p className="mt-2 font-black">
                    {beneficiaryName || "Not entered"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Processing</p>
                  <p className="mt-2 font-black">
                    {transferType === "FLUIDO"
                      ? "Instant internal transfer"
                      : "External bank review"}
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
                  Internal beneficiaries are detected automatically by IBAN.
                </p>

                <p className="rounded-2xl bg-slate-50 p-4">
                  The beneficiary receives an email when the transfer is
                  completed.
                </p>

                <p className="rounded-2xl bg-slate-50 p-4">
                  External bank transfers may require admin review before final
                  execution.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}