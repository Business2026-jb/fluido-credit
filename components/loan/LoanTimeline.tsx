type TimelineItem = {
  status: string;
  note?: string | null;
  createdAt: Date;
};

type LoanTimelineProps = {
  items: TimelineItem[];
};

export default function LoanTimeline({ items }: LoanTimelineProps) {
  const defaultSteps = [
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "FUNDED",
    "CLOSED",
  ];

  const steps = items.length > 0 ? items : defaultSteps.map((status) => ({
    status,
    note: null,
    createdAt: new Date(),
  }));

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Loan progress</h2>

      <div className="mt-6 space-y-5">
        {steps.map((item, index) => (
          <div key={`${item.status}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062B8C] text-sm font-black text-white">
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className="mt-2 h-10 w-0.5 bg-slate-200" />
              )}
            </div>

            <div>
              <p className="font-black text-[#06183A]">
                {item.status.replaceAll("_", " ")}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {item.note || "Step registered in your loan file."}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}