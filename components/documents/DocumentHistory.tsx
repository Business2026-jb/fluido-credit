import DocumentCard from "./DocumentCard";

type Document = {
  id: string;
  type: string;
  fileName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  rejectionReason?: string | null;
  reviewComment?: string | null;
};

type DocumentHistoryProps = {
  documents: Document[];
};

export default function DocumentHistory({ documents }: DocumentHistoryProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">📄</div>

        <h3 className="mt-4 text-xl font-black text-[#06183A]">
          No documents uploaded
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Your uploaded documents will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#06183A]">
            Document History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review all uploaded verification documents.
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-[#062B8C]">
          {documents.length} document{documents.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            id={document.id}
            type={document.type}
            fileName={document.fileName}
            status={document.status}
            createdAt={document.createdAt}
            rejectionReason={document.rejectionReason}
            reviewComment={document.reviewComment}
          />
        ))}
      </div>
    </div>
  );
}