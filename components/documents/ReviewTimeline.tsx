type ReviewTimelineItem = {
  id: string;
  title: string;
  message: string;
  date: Date;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

type ReviewTimelineProps = {
  items: ReviewTimelineItem[];
};

export default function ReviewTimeline({ items }: ReviewTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#06183A]">Review Timeline</h2>
        <p className="mt-3 text-sm text-slate-500">
          Your verification activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-[#06183A]">Review Timeline</h2>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-[#062B8C]" />
              <div className="mt-2 h-full w-0.5 bg-slate-200" />
            </div>

            <div className="pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black text-[#06183A]">{item.title}</p>

                {item.status && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    {item.status}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">{item.message}</p>

              <p className="mt-2 text-xs font-bold text-slate-400">
                {new Date(item.date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}