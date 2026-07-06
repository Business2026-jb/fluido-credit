"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/app/AppShell";

type DepositMethod = "USDT_TRC20" | "BANK_TRANSFER";

const APP_URL = "https://fluidocredit.com";

const USDT_ADDRESS = "TMqzwbe8ii3Q5e9c5zMB5xiA7o7EcaXbs8";
const USDT_NETWORK = "TRX Tron (TRC20)";

const BANK_DETAILS = {
  name: "Christian Penner",
  iban: "DE12100180000732239059",
  bic: "FNOMDEB2",
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function DepositPage() {
  const [method, setMethod] = useState<DepositMethod>("USDT_TRC20");
  const [amount, setAmount] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);

  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
      USDT_ADDRESS
    )}`;
  }, []);

  async function copyText(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1800);
  }

  async function submitDeposit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (numericAmount <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    if (!proofFile) {
      setError("Please upload your payment proof as PDF, JPG or PNG.");
      return;
    }

    if (!accepted) {
      setError("Please confirm that you have completed the payment.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("amount", String(numericAmount));
      formData.append("currency", "EUR");
      formData.append("method", method);
      formData.append("proof", proofFile);

      const res = await fetch("/api/deposits/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to submit deposit request.");
        return;
      }

      setMessage(
        `Deposit request submitted successfully. Reference: ${data.reference}`
      );

      setAmount("");
      setProofFile(null);
      setAccepted(false);
    } catch {
      setError("Unable to submit deposit request. Please try again.");
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
                  Fluido Credit Deposit
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  Add money to your account
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
                  Choose USDT TRC20 or bank transfer, complete the payment, then
                  upload your proof. Your Fluido balance will be credited after
                  admin verification.
                </p>
              </div>

              <Link
                href={`${APP_URL}/transactions`}
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-[#062B8C]"
              >
                View Transactions
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">USDT TRC20</p>
                <p className="mt-2 text-xl font-black">10–20 minutes</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">
                  Instant Bank Transfer
                </p>
                <p className="mt-2 text-xl font-black">5–20 minutes</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold text-blue-100">
                  Standard Bank Transfer
                </p>
                <p className="mt-2 text-xl font-black">Up to 24h</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
            <form
              onSubmit={submitDeposit}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
            >
              <h2 className="text-xl font-black text-[#06183A]">
                Deposit details
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the amount, choose your payment method and upload the
                proof of payment for admin validation.
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

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Deposit amount
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

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMethod("USDT_TRC20")}
                  className={`rounded-[2rem] border p-5 text-left transition ${
                    method === "USDT_TRC20"
                      ? "border-[#062B8C] bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#062B8C]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-xl font-black text-white">
                      ₮
                    </div>
                    <div>
                      <p className="text-lg font-black text-[#06183A]">
                        USDT Deposit
                      </p>
                      <p className="text-sm text-slate-500">
                        TRX Tron (TRC20)
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("BANK_TRANSFER")}
                  className={`rounded-[2rem] border p-5 text-left transition ${
                    method === "BANK_TRANSFER"
                      ? "border-[#062B8C] bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#062B8C]"
                  }`}
                >
                  <p className="text-lg font-black text-[#06183A]">
                    Bank Transfer
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    SEPA / European bank transfer
                  </p>
                </button>
              </div>

              {method === "USDT_TRC20" ? (
                <div className="mt-6 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <img
                        src={qrCodeUrl}
                        alt="USDT TRC20 deposit QR code"
                        className="h-56 w-56 rounded-2xl"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                        USDT Deposit Details
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-[#06183A]">
                        Send USDT on TRC20 only
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <p>
                          <strong>Network:</strong> {USDT_NETWORK}
                        </p>

                        <div>
                          <p className="font-bold text-slate-600">
                            Wallet address
                          </p>
                          <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-white p-4 md:flex-row md:items-center md:justify-between">
                            <span className="break-all font-black text-[#06183A]">
                              {USDT_ADDRESS}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                copyText(USDT_ADDRESS, "USDT address")
                              }
                              className="rounded-xl bg-[#062B8C] px-4 py-2 text-sm font-black text-white"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <p className="rounded-2xl bg-white p-4 text-slate-600">
                          Validation time: 10 to 20 minutes after admin confirms
                          the payment on-chain.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[2rem] border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-black uppercase tracking-widest text-[#062B8C]">
                    Bank Transfer Details
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-[#06183A]">
                    Send your bank transfer to this account
                  </h3>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-bold text-slate-500">Name</p>
                      <p className="mt-2 break-all font-black">
                        {BANK_DETAILS.name}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-bold text-slate-500">IBAN</p>
                      <p className="mt-2 break-all font-black">
                        {BANK_DETAILS.iban}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyText(BANK_DETAILS.iban, "IBAN")}
                        className="mt-3 rounded-xl bg-[#062B8C] px-4 py-2 text-xs font-black text-white"
                      >
                        Copy IBAN
                      </button>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-bold text-slate-500">BIC</p>
                      <p className="mt-2 break-all font-black">
                        {BANK_DETAILS.bic}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyText(BANK_DETAILS.bic, "BIC")}
                        className="mt-3 rounded-xl bg-[#062B8C] px-4 py-2 text-xs font-black text-white"
                      >
                        Copy BIC
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    Instant transfer: 5 to 20 minutes after admin confirmation.
                    Standard bank transfer: balance credited within 24 hours
                    after payment confirmation.
                  </p>
                </div>
              )}

              {copied && (
                <div className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-black text-[#062B8C]">
                  {copied} copied successfully.
                </div>
              )}

              <div className="mt-6">
                <label className="text-sm font-bold text-slate-600">
                  Upload payment proof
                </label>

                <input
                  required
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#062B8C] focus:bg-white"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Accepted files: PDF, JPG, PNG. Upload a clear payment receipt
                  or transaction screenshot.
                </p>
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
                    I confirm that I have sent the payment to the correct
                    Fluido Credit deposit details and uploaded a valid payment
                    proof.
                  </span>
                </label>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="mt-6 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#041f66] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting deposit..." : "Confirm Deposit Request"}
              </button>
            </form>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
                <p className="text-sm font-bold text-blue-100">
                  Deposit Summary
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-blue-100">Amount</p>
                    <p className="mt-1 text-3xl font-black">
                      {formatEuro(numericAmount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-blue-100">Selected method</p>
                    <p className="mt-2 font-black">
                      {method === "USDT_TRC20"
                        ? "USDT TRC20"
                        : "Bank Transfer"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-blue-100">Proof file</p>
                    <p className="mt-2 break-all font-black">
                      {proofFile?.name || "Not uploaded"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-blue-100">Crediting</p>
                    <p className="mt-2 font-black">
                      After admin validation
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#06183A]">
                  Important rules
                </h2>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p className="rounded-2xl bg-slate-50 p-4">
                    USDT must be sent only on TRX Tron TRC20 network.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    Upload proof immediately after sending the payment.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    Admin receives your request by email and validates the
                    deposit before your balance is credited.
                  </p>

                  <p className="rounded-2xl bg-slate-50 p-4">
                    You receive email confirmation when the request is submitted
                    and when admin approves or rejects it.
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