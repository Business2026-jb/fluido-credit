import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function NeedFinancing() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#02142F] via-[#062B8C] to-[#0B5FFF] p-8 text-white shadow-2xl">

      {/* Background Effects */}
      <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">

        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

          <BadgeCheck size={16} />

          <span className="text-xs font-black uppercase tracking-widest">
            Premium Financing
          </span>

        </div>

        {/* Title */}

        <h2 className="mt-7 text-4xl font-black leading-tight">
          Finance your projects with confidence.
        </h2>

        <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">
          Apply online in minutes and receive a secure decision.
          Fluido Credit provides fast, transparent and reliable financing
          for personal and business needs.
        </p>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-3 gap-4">

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">

            <p className="text-xs uppercase tracking-widest text-blue-100">
              Approval
            </p>

            <h3 className="mt-2 text-2xl font-black">
              96%
            </h3>

          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">

            <p className="text-xs uppercase tracking-widest text-blue-100">
              Decision
            </p>

            <h3 className="mt-2 text-2xl font-black">
              24h
            </h3>

          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">

            <p className="text-xs uppercase tracking-widest text-blue-100">
              Security
            </p>

            <h3 className="mt-2 text-2xl font-black">
              100%
            </h3>

          </div>

        </div>

        {/* Features */}

        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <Clock3 size={22} />

            </div>

            <div>

              <p className="font-black">
                Fast online approval
              </p>

              <p className="text-sm text-blue-100">
                Quick review and processing.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <ShieldCheck size={22} />

            </div>

            <div>

              <p className="font-black">
                Bank-grade security
              </p>

              <p className="text-sm text-blue-100">
                Your data is encrypted and protected.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <Wallet size={22} />

            </div>

            <div>

              <p className="font-black">
                Flexible repayment
              </p>

              <p className="text-sm text-blue-100">
                Choose the repayment plan that fits you.
              </p>

            </div>

          </div>

        </div>

        {/* CTA */}

        <Link
          href="/loans/apply"
          className="group mt-10 flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-lg font-black text-[#062B8C] transition-all duration-300 hover:scale-[1.02]"
        >

          Apply for a Loan

          <ArrowRight
            size={20}
            className="transition group-hover:translate-x-1"
          />

        </Link>

      </div>

    </div>
  );
}