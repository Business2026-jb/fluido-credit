type DocumentStatusBadgeProps = {
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function DocumentStatusBadge({
  status,
}: DocumentStatusBadgeProps) {
  const config = {
    PENDING: {
      label: "Pending Review",
      className:
        "bg-amber-100 text-amber-700 border border-amber-200",
    },
    APPROVED: {
      label: "Approved",
      className:
        "bg-emerald-100 text-emerald-700 border border-emerald-200",
    },
    REJECTED: {
      label: "Rejected",
      className:
        "bg-red-100 text-red-700 border border-red-200",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-black ${current.className}`}
    >
      {current.label}
    </span>
  );
}