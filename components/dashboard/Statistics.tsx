type StatisticsProps = {
  activeLoans: number;
  documents: number;
  notifications: number;
  sessions: number;
};

export default function Statistics({
  activeLoans,
  documents,
  notifications,
  sessions,
}: StatisticsProps) {
  const stats = [
    ["Active loans", activeLoans, "🏦"],
    ["Documents", documents, "📄"],
    ["Notifications", notifications, "🔔"],
    ["Sessions", sessions, "🛡️"],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(([label, value, icon]) => (
        <div
          key={label as string}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="text-2xl">{icon}</div>
          <p className="mt-3 text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
      ))}
    </div>
  );
}