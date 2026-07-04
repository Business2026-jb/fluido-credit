import {
  TrendingUp,
  CircleDollarSign,
  Landmark,
  BadgeEuro,
} from "lucide-react";

const formatMoney = (
  value: number,
  currency = "EUR"
) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

type Props = {
  totalRequested: number;
  totalApproved: number;
  totalMonthlyPayment: number;
};

export default function FinancialSummary({
  totalRequested,
  totalApproved,
  totalMonthlyPayment,
}: Props) {
  const approvalRate =
    totalRequested > 0
      ? Math.round((totalApproved / totalRequested) * 100)
      : 0;

  const cards = [
    {
      title: "Total Requested",
      value: formatMoney(totalRequested),
      subtitle: "All submitted financing requests",
      icon: CircleDollarSign,
      color:
        "from-blue-600 to-[#062B8C]",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      title: "Approved Capital",
      value: formatMoney(totalApproved),
      subtitle: `${approvalRate}% approval rate`,
      icon: Landmark,
      color:
        "from-emerald-500 to-emerald-700",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      title: "Monthly Payments",
      value: formatMoney(totalMonthlyPayment),
      subtitle: "Current repayment amount",
      icon: BadgeEuro,
      color:
        "from-purple-600 to-indigo-700",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
  ];

  return (
    <section>

      <div className="mb-6">

        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
          Banking Overview
        </span>

        <h2 className="mt-5 text-3xl font-black text-[#06183A]">
          Financial Summary
        </h2>

        <p className="mt-2 text-slate-500">
          Overview of your financing activity and repayments.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color}`}
              />

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-3xl ${card.bg}`}
                >

                  <Icon
                    size={30}
                    className={card.text}
                  />

                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">

                  <TrendingUp
                    size={15}
                    className="text-emerald-600"
                  />

                  <span className="text-xs font-black text-emerald-600">
                    LIVE
                  </span>

                </div>

              </div>

              <h3 className="mt-8 text-lg font-black text-[#06183A]">
                {card.title}
              </h3>

              <p className="mt-4 text-4xl font-black text-[#06183A]">
                {card.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {card.subtitle}
              </p>

            </div>

          );
        })}

      </div>

      <div className="mt-8 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-[#06183A] via-[#062B8C] to-[#0B5FFF] p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <p className="text-sm uppercase tracking-widest text-blue-200">
              Financing Health
            </p>

            <h3 className="mt-3 text-4xl font-black">
              {approvalRate}%
            </h3>

            <p className="mt-4 max-w-xl text-blue-100 leading-7">
              This score reflects the percentage of your requested financing
              that has been approved by Fluido Credit.
            </p>

          </div>

          <div className="w-full max-w-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="font-bold">
                Approval Progress
              </span>

              <span className="font-black">
                {approvalRate}%
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${approvalRate}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}