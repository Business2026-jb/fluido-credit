type BalanceCardProps = {
  balance: number;
  availableBalance: number;
  blockedBalance: number;
  currency: string;
  iban?: string | null;
};

const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function BalanceCard({
  balance,
  availableBalance,
  blockedBalance,
  currency,
  iban,
}: BalanceCardProps) {
  return (
    <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl shadow-blue-900/10">
      <p className="text-sm font-bold text-blue-100">Available balance</p>

      <h2 className="mt-6 text-4xl font-black">
        {formatMoney(availableBalance, currency)}
      </h2>

      <p className="mt-3 text-sm font-bold text-emerald-300">
        Main account · {currency}
      </p>

      <div className="mt-6 rounded-2xl bg-white/10 p-4">
        <p className="text-sm text-blue-100">Total balance</p>
        <p className="mt-2 text-2xl font-black">
          {formatMoney(balance, currency)}
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-white/10 p-4">
        <p className="text-sm text-blue-100">Blocked balance</p>
        <p className="mt-2 text-xl font-black">
          {formatMoney(blockedBalance, currency)}
        </p>
      </div>

      <p className="mt-5 break-all text-xs font-bold text-blue-100">
        IBAN: {iban || "Not available"}
      </p>
    </div>
  );
}