"use client";

import { useState } from "react";
import { Eye, EyeOff, CreditCard, ShieldCheck } from "lucide-react";

type VirtualBankCardProps = {
  holder: string;
  number: string;
  maskedNumber: string;
  expiry: string;
  cvv: string;
  maskedCvv: string;
  brand: string;
  type: string;
  status: string;
};

export default function VirtualBankCard({
  holder,
  number,
  maskedNumber,
  expiry,
  cvv,
  maskedCvv,
  brand,
  type,
  status,
}: VirtualBankCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-5">
      {/* CARD */}
      <div className="mx-auto w-full max-w-[540px] rounded-[2rem] bg-[#050B1A] p-5 text-white shadow-2xl">
        <div className="overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-[#1057E8] via-[#062B8C] to-[#061B55] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-blue-100">
                FLUIDO
              </p>

              <p className="text-xl font-black tracking-wide">
                CREDIT
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black">{brand}</p>
              <p className="text-xs font-bold text-blue-100">{type}</p>
            </div>
          </div>

          <div className="mt-8 h-8 w-12 rounded-lg bg-yellow-300" />

          <div className="mt-7 text-[22px] font-black tracking-[0.18em]">
            {showDetails ? number : maskedNumber}
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-100">
                Holder
              </p>

              <p className="mt-2 truncate text-xs font-black">
                {holder}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-100">
                Exp
              </p>

              <p className="mt-2 text-xs font-black">
                {expiry}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-100">
                CVV
              </p>

              <p className="mt-2 text-xs font-black">
                {showDetails ? cvv : maskedCvv}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-medium text-blue-100">Card status</span>

          <span className="rounded-full bg-emerald-400/20 px-4 py-2 font-black text-emerald-300">
            {status}
          </span>
        </div>
      </div>

      {/* STATUS */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Card Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />

              <span className="font-black text-green-700">
                {status}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#041E63]"
          >
            {showDetails ? (
              <>
                <EyeOff size={18} />
                Hide Details
              </>
            ) : (
              <>
                <Eye size={18} />
                Show Details
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECURITY */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-[#062B8C]" />

          <div>
            <p className="font-black text-[#06183A]">
              Secure Virtual Card
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your card information is protected. Click "Show Details" to display the full card number and CVV when needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}