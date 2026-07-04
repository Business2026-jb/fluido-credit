import Link from "next/link";

type LoanActionsProps = {
  loanId: string;
};

export default function LoanActions({ loanId }: LoanActionsProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Actions</h2>

      <div className="mt-5 grid gap-3">
        <Link
          href={`/loans/${loanId}`}
          className="rounded-2xl bg-[#062B8C] px-4 py-4 text-center text-sm font-black text-white"
        >
          View loan details
        </Link>

        <Link
          href={`/documents`}
          className="rounded-2xl border border-slate-200 px-4 py-4 text-center text-sm font-black hover:border-blue-600 hover:bg-blue-50"
        >
          Upload documents
        </Link>

        <Link
          href={`/support`}
          className="rounded-2xl border border-slate-200 px-4 py-4 text-center text-sm font-black hover:border-blue-600 hover:bg-blue-50"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}