"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowDownLeft, ArrowUpRight, BarChart3 } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  type: string;
  direction: "IN" | "OUT";
  amount: number;
  currency: string;
  createdAt: Date;
};

const formatMoney = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function DashboardCharts({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const incoming = transactions
    .filter((t) => t.direction === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const outgoing = transactions
    .filter((t) => t.direction === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = incoming - outgoing;

  const baseData =
    transactions.length === 0
      ? [
          { date: "Mon", balance: 1200, incoming: 300, outgoing: 120 },
          { date: "Tue", balance: 1450, incoming: 420, outgoing: 150 },
          { date: "Wed", balance: 1320, incoming: 180, outgoing: 310 },
          { date: "Thu", balance: 1680, incoming: 520, outgoing: 160 },
          { date: "Fri", balance: 1910, incoming: 380, outgoing: 140 },
          { date: "Sat", balance: 1760, incoming: 210, outgoing: 360 },
          { date: "Sun", balance: 2140, incoming: 640, outgoing: 260 },
        ]
      : transactions
          .slice(0, 10)
          .reverse()
          .map((tx, index) => ({
            date: new Date(tx.createdAt).toLocaleDateString("en-IE", {
              day: "2-digit",
              month: "short",
            }),
            balance: transactions
              .slice(0, index + 1)
              .reduce(
                (sum, item) =>
                  item.direction === "IN"
                    ? sum + item.amount
                    : sum - item.amount,
                0
              ),
            incoming: tx.direction === "IN" ? tx.amount : 0,
            outgoing: tx.direction === "OUT" ? tx.amount : 0,
          }));

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
            Live Analytics
          </span>

          <h2 className="mt-5 text-3xl font-black text-[#06183A]">
            Account Performance
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {transactions.length === 0
              ? "Preview analytics will be replaced by your real banking data after your first transaction."
              : "Real-time analytics based on your latest banking transactions."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50 p-5">
            <div className="flex items-center gap-2">
              <ArrowDownLeft size={18} className="text-emerald-600" />
              <p className="text-xs font-black uppercase text-emerald-700">
                Cash In
              </p>
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-600">
              {formatMoney(incoming)}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-5">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={18} className="text-red-500" />
              <p className="text-xs font-black uppercase text-red-600">
                Cash Out
              </p>
            </div>
            <p className="mt-3 text-3xl font-black text-red-500">
              {formatMoney(outgoing)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] bg-slate-50 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-black text-[#06183A]">Balance Trend</h3>
              <p className="mt-1 text-xs font-bold text-slate-400">
                Account movement overview
              </p>
            </div>
            <Activity size={22} className="text-[#062B8C]" />
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={baseData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#062B8C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#062B8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#062B8C"
                  strokeWidth={4}
                  fill="url(#balanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-50 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-black text-[#06183A]">Cash Flow</h3>
              <p className="mt-1 text-xs font-bold text-slate-400">
                Incoming vs outgoing
              </p>
            </div>
            <BarChart3 size={22} className="text-[#062B8C]" />
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={baseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Bar dataKey="incoming" fill="#10B981" radius={[10, 10, 0, 0]} />
                <Bar dataKey="outgoing" fill="#062B8C" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-[#06183A] p-6 text-white">
          <p className="text-sm text-blue-100">Net Cash Flow</p>
          <h3 className="mt-4 text-4xl font-black">{formatMoney(net)}</h3>
          <p className="mt-3 text-sm text-blue-200">
            Difference between incoming and outgoing operations.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-bold text-slate-500">Monthly Volume</p>
          <h3 className="mt-4 text-4xl font-black text-[#06183A]">
            {transactions.length}
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Real banking operations processed this month.
          </p>
        </div>
      </div>
    </div>
  );
}