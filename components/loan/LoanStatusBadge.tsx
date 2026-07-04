type LoanStatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
  FUNDED: "bg-indigo-50 text-indigo-700",
  CLOSED: "bg-zinc-100 text-zinc-700",
};

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const label = status.replaceAll("_", " ");

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}