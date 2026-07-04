import Link from "next/link";
import LoanStatusBadge from "./LoanStatusBadge";

type LoanCardProps = {
  id: string;
  purpose?: string | null;
  status: string;
  amount: number;
  durationMonths: number;
  annualRate: number;
  monthlyPayment: number;
  createdAt: Date;
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function LoanCard({
  id,
  purpose,
  status,
  amount,
  durationMonths,
  annualRate,
  monthlyPayment,
  createdAt,
}: LoanCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-[#06183A]">
            {purpose || "Loan request"}
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-400">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <LoanStatusBadge status={status} />
      </div>

      <p className="mt-6 text-3xl font-black text-[#06183A]">
        {formatEuro(amount)}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-400">Rate</p>
          <p className="font-black">{annualRate}%</p>
        </div>
        <div>
          <p className="text-slate-400">Term</p>
          <p className="font-black">{durationMonths} mo</p>
        </div>
        <div>
          <p className="text-slate-400">Monthly</p>
          <p className="font-black">{formatEuro(monthlyPayment)}</p>
        </div>
      </div>

      <Link
        href={`/loans/${id}`}
        className="mt-6 block rounded-2xl bg-[#062B8C] py-4 text-center text-sm font-black text-white"
      >
        View details
      </Link>
    </div>
  );
}