type KycStepProps = {
  icon: string;
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  active?: boolean;
  completed?: boolean;
};

export default function KycStep({
  icon,
  title,
  description,
  stepNumber,
  totalSteps,
  active = false,
  completed = false,
}: KycStepProps) {
  return (
    <div
      className={`rounded-[2rem] border p-5 shadow-sm ${
        active
          ? "border-blue-600 bg-blue-50"
          : completed
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            Step {stepNumber} of {totalSteps}
          </p>

          <h3 className="mt-1 text-lg font-black text-[#06183A]">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

          <p
            className={`mt-4 text-sm font-black ${
              completed
                ? "text-emerald-700"
                : active
                ? "text-[#062B8C]"
                : "text-slate-400"
            }`}
          >
            {completed ? "Completed" : active ? "Current step" : "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}