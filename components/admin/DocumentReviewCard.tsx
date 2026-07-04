import Link from "next/link";
import DocumentStatusBadge from "./DocumentStatusBadge";

type DocumentReviewCardProps = {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  reviewComment?: string | null;
  reviewedAt?: Date | null;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  loanId?: string | null;
  uploadedAt: Date;
};

export default function DocumentReviewCard({
  id,
  type,
  fileName,
  status,
  rejectionReason,
  reviewComment,
  reviewedAt,
  customer,
  loanId,
  uploadedAt,
}: DocumentReviewCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-black text-[#06183A]">{type}</h2>
            <DocumentStatusBadge status={status} />
          </div>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p><strong>Customer:</strong> {customer.fullName}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>File:</strong> {fileName}</p>
            <p><strong>Uploaded:</strong> {new Date(uploadedAt).toLocaleString()}</p>
            <p><strong>Loan:</strong> {loanId || "Not linked"}</p>
            <p><strong>Reviewed at:</strong> {reviewedAt ? new Date(reviewedAt).toLocaleString() : "Not reviewed yet"}</p>
          </div>

          {(rejectionReason || reviewComment) && (
            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
              {rejectionReason || reviewComment}
            </div>
          )}

          <Link
            href={`/api/documents/view?id=${id}`}
            target="_blank"
            className="mt-5 inline-block rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white"
          >
            Open document
          </Link>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <h3 className="font-black text-[#06183A]">Review action</h3>

          <form
            action="/api/admin/documents/update-status"
            method="POST"
            className="mt-4 space-y-3"
          >
            <input type="hidden" name="documentId" value={id} />

            <textarea
              name="rejectionReason"
              placeholder="Comment or reason if needed..."
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none"
            />

            <button name="status" value="APPROVED" className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white">
              Approve
            </button>

            <button name="status" value="REJECTED" className="w-full rounded-2xl bg-red-600 py-3 text-sm font-black text-white">
              Reject
            </button>

            <button name="status" value="PENDING" className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-black text-white">
              Request more information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}