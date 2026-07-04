type AccountBalanceProps = {
  account: {
    availableBalance: number;
    balance: number;
    blockedBalance: number;
    currency: string;
    name: string;
    iban: string | null;
    bic: string | null;
    isActive: boolean;
  };
};

const formatMoney = (
  value: number,
  currency = "EUR"
) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function AccountBalance({
  account,
}: AccountBalanceProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#031633] via-[#062B8C] to-[#0B5FFF] p-7 text-white shadow-2xl">

      {/* Decorative */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-start justify-between">

          <div>

            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-widest">
              Main Account
            </span>

            <h2 className="mt-6 text-sm font-semibold text-blue-100">
              Available Balance
            </h2>

            <p className="mt-2 text-5xl font-black tracking-tight">
              {formatMoney(
                account.availableBalance,
                account.currency
              )}
            </p>

          </div>

          <div
            className={`rounded-full px-4 py-2 text-xs font-black ${
              account.isActive
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {account.isActive ? "ACTIVE" : "INACTIVE"}
          </div>

        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-xs uppercase tracking-wider text-blue-100">
              Total Balance
            </p>

            <h3 className="mt-3 text-2xl font-black">
              {formatMoney(
                account.balance,
                account.currency
              )}
            </h3>

          </div>

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-xs uppercase tracking-wider text-blue-100">
              Blocked Funds
            </p>

            <h3 className="mt-3 text-2xl font-black">
              {formatMoney(
                account.blockedBalance,
                account.currency
              )}
            </h3>

          </div>

        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/10 p-6 backdrop-blur">

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <p className="text-xs uppercase tracking-widest text-blue-100">
                Account Name
              </p>

              <p className="mt-2 text-lg font-black">
                {account.name}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-blue-100">
                Currency
              </p>

              <p className="mt-2 text-lg font-black">
                {account.currency}
              </p>

            </div>

          </div>

          <div className="mt-6">

            <p className="text-xs uppercase tracking-widest text-blue-100">
              IBAN
            </p>

            <p className="mt-2 break-all font-mono text-sm">
              {account.iban}
            </p>

          </div>

          <div className="mt-6 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-widest text-blue-100">
                BIC / SWIFT
              </p>

              <p className="mt-2 font-black">
                {account.bic}
              </p>

            </div>

            <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-black">
              Secure Banking
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}