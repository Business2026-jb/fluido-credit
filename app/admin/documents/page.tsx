import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DocumentReviewCard from "@/components/admin/DocumentReviewCard";

export default async function AdminDocumentsPage() {
  await requireAdmin();

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      loanApplication: true,
      reviewedBy: true,
    },
    take: 100,
  });

  const pending = documents.filter((doc) => doc.status === "PENDING");
  const approved = documents.filter((doc) => doc.status === "APPROVED");
  const rejected = documents.filter((doc) => doc.status === "REJECTED");

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              Admin Document Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Document Review
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review customer files, approve documents, reject invalid uploads or request more information.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <AdminStatCard
            title="Total Documents"
            value={documents.length}
            icon="📄"
            tone="dark"
          />

          <AdminStatCard
            title="Pending Review"
            value={pending.length}
            icon="⏳"
            tone="amber"
          />

          <AdminStatCard
            title="Approved"
            value={approved.length}
            icon="✅"
            tone="green"
          />

          <AdminStatCard
            title="Rejected"
            value={rejected.length}
            icon="❌"
            tone="red"
          />
        </div>

        <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-[#06183A]">
            Review Queue
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Newest documents are shown first. Open each file before approving or rejecting it.
          </p>
        </div>

        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-[#06183A]">
                No documents yet
              </h2>
              <p className="mt-2 text-slate-500">
                Uploaded customer documents will appear here.
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentReviewCard
                key={doc.id}
                id={doc.id}
                type={doc.type}
                fileName={doc.fileName}
                fileUrl={doc.fileUrl}
                status={doc.status}
                rejectionReason={doc.rejectionReason}
                reviewComment={doc.reviewComment}
                reviewedAt={doc.reviewedAt}
                customer={{
                  fullName: doc.user.fullName,
                  email: doc.user.email,
                  phone: doc.user.phone,
                }}
                loanId={doc.loanApplicationId}
                uploadedAt={doc.createdAt}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}