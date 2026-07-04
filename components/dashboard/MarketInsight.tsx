"use client";

import {
  Activity,
  TrendingUp,
  TrendingDown,
  Bitcoin,
  DollarSign,
  Euro,
} from "lucide-react";

const markets = [
  {
    asset: "Bitcoin",
    symbol: "BTC",
    price: "$118,425.40",
    change: "+2.36%",
    up: true,
    icon: Bitcoin,
  },
  {
    asset: "Ethereum",
    symbol: "ETH",
    price: "$4,126.12",
    change: "+1.74%",
    up: true,
    icon: Activity,
  },
  {
    asset: "Solana",
    symbol: "SOL",
    price: "$181.42",
    change: "-0.81%",
    up: false,
    icon: Activity,
  },
  {
    asset: "EUR / USD",
    symbol: "FX",
    price: "1.1734",
    change: "+0.22%",
    up: true,
    icon: Euro,
  },
  {
    asset: "GBP / USD",
    symbol: "FX",
    price: "1.3698",
    change: "-0.11%",
    up: false,
    icon: DollarSign,
  },
];

export default function MarketInsight() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-slate-100 p-7">

        <div className="flex items-center justify-between">

          <div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
              Live Markets
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#06183A]">
              Market Insight
            </h2>

            <p className="mt-2 text-slate-500">
              Financial markets and exchange overview.
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-xs font-black text-emerald-700">
              LIVE
            </span>

          </div>

        </div>

      </div>

      {/* List */}

      <div className="divide-y divide-slate-100">

        {markets.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.asset}
              className="group flex items-center justify-between p-6 transition hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF]">

                  <Icon
                    size={26}
                    className="text-[#062B8C]"
                  />

                </div>

                <div>

                  <h3 className="font-black text-[#06183A]">
                    {item.asset}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.symbol}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="text-xl font-black text-[#06183A]">
                  {item.price}
                </p>

                <div
                  className={`mt-2 flex items-center justify-end gap-1 font-black ${
                    item.up
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >

                  {item.up ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}

                  {item.change}

                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-100 bg-slate-50 p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Data Refresh
            </p>

            <p className="mt-2 text-lg font-black text-[#06183A]">
              Every 60 Seconds
            </p>

          </div>

          <div className="rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white">
            Live Feed
          </div>

        </div>

      </div>

    </div>
  );
}