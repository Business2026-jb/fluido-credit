"use client";

import { useEffect, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
};

export default function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    async function loadCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,polkadot,chainlink,litecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
        );

        const data = await res.json();
        setCoins(data);
      } catch {
        setCoins([]);
      }
    }

    loadCoins();
    const interval = setInterval(loadCoins, 60000);

    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-4 whitespace-nowrap">
        {[...coins, ...coins].map((coin, index) => (
          <div
            key={`${coin.id}-${index}`}
            className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-3"
          >
            <div>
              <p className="text-sm font-black text-[#06183A]">
                {coin.name} ({coin.symbol.toUpperCase()})
              </p>
              <p className="text-xs font-bold text-slate-500">
                €{coin.current_price.toLocaleString()}
              </p>
            </div>

            <span
              className={`text-sm font-black ${
                coin.price_change_percentage_24h >= 0
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}