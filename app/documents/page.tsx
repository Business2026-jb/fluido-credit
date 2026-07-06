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
      <main className="min-h-screen bg-[#F5F7FB]">
        <section className="w-full px-4 py-6 md:px-8">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06183A] via-[#062B8C] to-[#0B5FFF] p-6 text-white shadow-xl md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-blue-100">
                    KYC Document Center
                  </p>

                  <h1 className="mt-3 text-3xl font-black md:text-5xl">
                    Identity Verification
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
                    Upload your verification documents securely. Your documents
                    are reviewed by Fluido Credit compliance within 24 business
                    hours.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-black text-[#062B8C]"
                >
                  My Profile
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold text-blue-100">Required</p>
                  <p className="mt-2 text-2xl font-black">
                    {TOTAL_REQUIRED_DOCUMENTS}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold text-blue-100">Approved</p>
                  <p className="mt-2 text-2xl font-black">{approved}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold text-blue-100">Pending</p>
                  <p className="mt-2 text-2xl font-black">{pending}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold text-blue-100">Rejected</p>
                  <p className="mt-2 text-2xl font-black">{rejected}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 2xl:grid-cols-[1fr_430px]">
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
                  <h2 className="text-xl font-black">Verification Rules</h2>

                  <div className="mt-5 space-y-4 text-sm leading-6 text-blue-100">
                    <p>PDF, JPG and PNG files are accepted.</p>
                    <p>Maximum file size: 10 MB per document.</p>
                    <p>Documents must be clear, readable and valid.</p>
                    <p>Compliance review usually takes 24 business hours.</p>
                    <p>Your data is encrypted and used only for verification.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}