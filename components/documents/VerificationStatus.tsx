type VerificationStatusProps = {
  emailVerified: boolean;
  phoneVerified: boolean;
  approvedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;
  totalRequiredDocuments: number;
};

export default function VerificationStatus({
  emailVerified,
  phoneVerified,
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments,
  totalRequiredDocuments,
}: VerificationStatusProps) {
  const progress = Math.round(
    (approvedDocuments / totalRequiredDocuments) * 100
  );

  return (
    <div className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-black text-[#06183A]">
            Verification Status
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your account verification progress.
          </p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-black text-[#062B8C]">
            {progress}%
          </p>

          <p className="text-xs font-bold text-slate-500">
            Completed
          </p>
        </div>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-[#062B8C]"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="font-bold">Email Verification</span>

          <span
            className={`font-black ${
              emailVerified
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {emailVerified ? "Verified" : "Pending"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="font-bold">Phone Verification</span>

          <span
            className={`font-black ${
              phoneVerified
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {phoneVerified ? "Verified" : "Pending"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="font-bold">Approved Documents</span>

          <span className="font-black text-emerald-600">
            {approvedDocuments}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="font-bold">Pending Review</span>

          <span className="font-black text-amber-600">
            {pendingDocuments}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="font-bold">Rejected Documents</span>

          <span className="font-black text-red-600">
            {rejectedDocuments}
          </span>
        </div>

      </div>

    </div>
  );
}