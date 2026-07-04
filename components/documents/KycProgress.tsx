type KycProgressProps = {
  totalRequired: number;
  approved: number;
  pending: number;
  rejected: number;
};

export default function KycProgress({
  totalRequired,
  approved,
  pending,
  rejected,
}: KycProgressProps) {
  const completed = approved + pending;
  const progress =
    totalRequired > 0 ? Math.min(Math.round((completed / totalRequired) * 100), 100) : 0;

  return (
    <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-100">
            Identity Verification
          </p>

          <h2 className="mt-2 text-2xl font-black">
            KYC Progress
          </h2>

          <p className="mt-2 text-sm leading-6 text-blue-100">
            Upload your required documents. Our compliance team will review them
            within 24 business hours.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
          <p className="text-3xl font-black">{progress}%</p>
          <p className="text-xs font-bold text-blue-100">Complete</p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Approved</p>
          <p className="mt-1 text-2xl font-black text-emerald-300">
            {approved}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Under review</p>
          <p className="mt-1 text-2xl font-black text-amber-300">
            {pending}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Rejected</p>
          <p className="mt-1 text-2xl font-black text-red-300">
            {rejected}
          </p>
        </div>
      </div>
    </div>
  );
}