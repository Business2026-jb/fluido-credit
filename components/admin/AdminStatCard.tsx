type AdminStatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  tone?: "blue" | "green" | "amber" | "red" | "dark";
};

const tones = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  dark: "bg-[#06183A] text-white",
};

export default function AdminStatCard({
  title,
  value,
  icon,
  tone = "blue",
}: AdminStatCardProps) {
  return (
    <div className={`rounded-[1.5rem] p-5 shadow-sm ${tones[tone]}`}>
      <div className="text-2xl">{icon}</div>
      <p className="mt-3 text-sm font-bold opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}