"use client";

const rates = [
  {
    pair: "EUR / USD",
    price: "1.1732",
    change: "+0.22%",
    up: true,
  },
  {
    pair: "EUR / GBP",
    price: "0.8568",
    change: "-0.12%",
    up: false,
  },
  {
    pair: "EUR / CHF",
    price: "0.9344",
    change: "+0.09%",
    up: true,
  },
  {
    pair: "USD / JPY",
    price: "147.82",
    change: "+0.18%",
    up: true,
  },
  {
    pair: "GBP / USD",
    price: "1.3685",
    change: "-0.08%",
    up: false,
  },
  {
    pair: "USD / CAD",
    price: "1.3574",
    change: "+0.14%",
    up: true,
  },
  {
    pair: "AUD / USD",
    price: "0.6621",
    change: "+0.05%",
    up: true,
  },
];

export default function ExchangeTicker() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#06183A]">
          Live Exchange Rates
        </h3>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex min-w-max animate-[ticker_35s_linear_infinite] gap-8 px-6 py-4">
          {[...rates, ...rates].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="font-black text-[#06183A]">
                {item.pair}
              </span>

              <span className="font-semibold text-slate-700">
                {item.price}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  item.up
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}