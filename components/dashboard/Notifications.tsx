type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function Notifications({ items }: { items: Notification[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Notifications</h2>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No notification yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex justify-between gap-3">
                <p className="font-black">{item.title}</p>
                {!item.isRead && (
                  <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-black text-white">
                    New
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}