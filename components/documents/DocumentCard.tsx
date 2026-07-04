import Link from "next/link";
import DocumentStatusBadge from "@/components/admin/DocumentStatusBadge";

type DocumentCardProps = {
  id: string;
  type: string;
  fileName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  rejectionReason?: string | null;
  reviewComment?: string | null;
};

export default function DocumentCard({
  id,
  type,
  fileName,
  status,
  createdAt,
  rejectionReason,
  reviewComment,
}: DocumentCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-[#06183A]">{type}</p>

          <p className="mt-1 break-all text-sm text-slate-500">{fileName}</p>

          <p className="mt-1 text-xs font-bold text-slate-400">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <DocumentStatusBadge status={status} />
      </div>

      {(rejectionReason || reviewComment) && (
        <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-700">
          {rejectionReason || reviewComment}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/api/documents/view?id=${id}`}
          target="_blank"
          className="rounded-xl bg-[#062B8C] px-4 py-2 text-sm font-black text-white"
        >
          Open document
        </Link>

        <a
          href={`/api/documents/view?id=${id}`}
          download
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-[#06183A]"
        >
          Download
        </a>
      </div>
    </div>
  );
}