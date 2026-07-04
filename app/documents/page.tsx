import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import KycProgress from "@/components/documents/KycProgress";
import KycWizard from "@/components/documents/KycWizard";
import VerificationStatus from "@/components/documents/VerificationStatus";
import DocumentHistory from "@/components/documents/DocumentHistory";
import ReviewTimeline from "@/components/documents/ReviewTimeline";

const TOTAL_REQUIRED_DOCUMENTS = 6;

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const documents = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const approved = documents.filter((doc) => doc.status === "APPROVED").length;
  const pending = documents.filter((doc) => doc.status === "PENDING").length;
  const rejected = documents.filter((doc) => doc.status === "REJECTED").length;

  const timelineItems = documents.map((doc) => ({
    id: doc.id,
    title: `${doc.type} uploaded`,
    message:
      doc.reviewComment ||
      doc.rejectionReason ||
      `Your ${doc.type} document was submitted for review.`,
    date: doc.reviewedAt || doc.createdAt,
    status: doc.status,
  }));

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-[#062B8C]">
              KYC Document Center
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#06183A] md:text-4xl">
              Identity Verification
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Upload your verification documents securely. Our compliance team
              reviews documents within 24 business hours.
            </p>
          </div>

          <Link
            href="/profile"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black"
          >
            My profile
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="space-y-6">
            <KycProgress
              totalRequired={TOTAL_REQUIRED_DOCUMENTS}
              approved={approved}
              pending={pending}
              rejected={rejected}
            />

            <KycWizard />

            <DocumentHistory documents={documents} />
          </div>

          <aside className="space-y-6">
            <VerificationStatus
              emailVerified={user.emailVerified}
              phoneVerified={Boolean(user.phone)}
              approvedDocuments={approved}
              pendingDocuments={pending}
              rejectedDocuments={rejected}
              totalRequiredDocuments={TOTAL_REQUIRED_DOCUMENTS}
            />

            <ReviewTimeline items={timelineItems} />

            <div className="rounded-[2rem] bg-[#06183A] p-6 text-white shadow-xl">
              <h2 className="text-xl font-black">Verification rules</h2>

              <div className="mt-5 space-y-4 text-sm text-blue-100">
                <p>✅ PDF, JPG and PNG accepted.</p>
                <p>✅ Maximum file size: 10 MB.</p>
                <p>✅ Documents are reviewed within 24 business hours.</p>
                <p>✅ Upload clear and readable documents.</p>
                <p>✅ Your data is protected and used only for verification.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}