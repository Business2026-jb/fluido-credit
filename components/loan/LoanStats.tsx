type LoanStatsProps = {
  totalRequested: number;
  totalApproved: number;
  activeLoans: number;
  rejectedLoans: number;
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function LoanStats({
  totalRequested,
  totalApproved,
  activeLoans,
  rejectedLoans,
}: LoanStatsProps) {
  const cards = [
    {
      title: "Total Requested",
      value: formatEuro(totalRequested),
      color: "bg-[#06183A] text-white",
    },
    {
      title: "Approved",
      value: formatEuro(totalApproved),
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Active Loans",
      value: activeLoans.toString(),
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Rejected",
      value: rejectedLoans.toString(),
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-[2rem] p-6 shadow-sm ${card.color}`}
        >
          <p className="text-sm font-bold opacity-80">
            {card.title}
          </p>

          <h2 className="mt-4 text-3xl font-black">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}