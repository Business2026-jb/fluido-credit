type BankCardProps = {
  fullName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  status: string;
};

export default function BankCard({
  fullName,
  cardNumber,
  expiry,
  cvv,
  status,
}: BankCardProps) {
  return (
    <div className="rounded-[2rem] bg-[#050B1A] p-5 text-white shadow-xl shadow-blue-900/10">
      <div className="rounded-[1.8rem] bg-gradient-to-br from-[#0B4FD8] via-[#062B8C] to-[#020817] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-blue-100">FLUIDO</p>
            <p className="text-xl font-black tracking-wide">CREDIT</p>
          </div>
          <p className="text-3xl font-black">VISA</p>
        </div>

        <div className="mt-10 text-xl font-black tracking-[0.2em]">
          {cardNumber}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-blue-100">HOLDER</p>
            <p className="mt-1 truncate font-black">{fullName.toUpperCase()}</p>
          </div>

          <div>
            <p className="text-blue-100">EXP</p>
            <p className="mt-1 font-black">{expiry}</p>
          </div>

          <div>
            <p className="text-blue-100">CVV</p>
            <p className="mt-1 font-black">{cvv}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-blue-100">Card status</span>
        <span className="rounded-full bg-emerald-400/20 px-3 py-1 font-black text-emerald-300">
          {status}
        </span>
      </div>
    </div>
  );
}