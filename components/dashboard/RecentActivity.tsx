import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  direction: "IN" | "OUT";
  amount: number;
  currency: string;
  createdAt: Date;
};

const formatMoney = (
  value: number,
  currency = "EUR"
) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function RecentActivity({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* HEADER */}

      <div className="border-b border-slate-100 p-7">

        <div className="flex items-center justify-between">

          <div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
              Banking
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#06183A]">
              Recent Activity
            </h2>

            <p className="mt-2 text-slate-500">
              Your latest banking operations.
            </p>

          </div>

          <Clock3
            size={26}
            className="text-[#062B8C]"
          />

        </div>

      </div>

      {/* LIST */}

      <div className="divide-y divide-slate-100">

        {transactions.length === 0 ? (

          <div className="p-12 text-center">

            <Clock3
              size={60}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-6 text-xl font-black text-[#06183A]">
              No activity
            </h3>

            <p className="mt-3 text-slate-500">
              Your banking activity will appear here.
            </p>

          </div>

        ) : (

          transactions.slice(0,8).map((tx)=>{

            const incoming = tx.direction==="IN";

            return(

              <div
                key={tx.id}
                className="group flex items-center justify-between p-6 transition hover:bg-slate-50"
              >

                <div className="flex items-center gap-5">

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl ${
                      incoming
                        ? "bg-emerald-100"
                        : "bg-red-100"
                    }`}
                  >

                    {incoming ? (

                      <ArrowDownLeft
                        size={28}
                        className="text-emerald-700"
                      />

                    ) : (

                      <ArrowUpRight
                        size={28}
                        className="text-red-600"
                      />

                    )}

                  </div>

                  <div>

                    <h3 className="text-lg font-black text-[#06183A]">
                      {tx.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {tx.description || tx.type}
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      <span className="text-xs text-slate-400">
                        {new Date(
                          tx.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-300"/>

                      <div className="flex items-center gap-1">

                        <CheckCircle2
                          size={14}
                          className="text-emerald-600"
                        />

                        <span className="text-xs font-bold text-emerald-600">
                          Completed
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <p
                    className={`text-2xl font-black ${
                      incoming
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >

                    {incoming ? "+" : "-"}

                    {formatMoney(
                      tx.amount,
                      tx.currency
                    )}

                  </p>

                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {tx.currency}
                  </p>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}