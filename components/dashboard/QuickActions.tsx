import Link from "next/link";

import {
  Landmark,
  ArrowRightLeft,
  Wallet,
  CreditCard,
  FileText,
  Receipt,
  ChevronRight,
} from "lucide-react";

const actions = [
  {
    title: "Apply for Loan",
    description: "Request financing online",
    href: "/loans/apply",
    icon: Landmark,
  },
  {
    title: "Withdraw",
    description: "Transfer funds securely",
    href: "/withdraw",
    icon: Wallet,
  },
  {
    title: "Transfer",
    description: "Send money instantly",
    href: "/transfers",
    icon: ArrowRightLeft,
  },
  {
    title: "Documents",
    description: "Upload verification files",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Cards",
    description: "Manage your bank cards",
    href: "/cards",
    icon: CreditCard,
  },
  {
    title: "Transactions",
    description: "Account activity",
    href: "/transactions",
    icon: Receipt,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#062B8C]">
            Banking
          </span>

          <h2 className="mt-5 text-3xl font-black text-[#06183A]">
            Quick Actions
          </h2>

          <p className="mt-2 text-slate-500">
            Fast access to your everyday banking services.
          </p>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              href={action.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#062B8C] hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] transition-all group-hover:bg-[#062B8C]">

                  <Icon
                    size={28}
                    className="text-[#062B8C] transition-all group-hover:text-white"
                  />

                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-300 transition-all group-hover:text-[#062B8C]"
                />

              </div>

              <h3 className="mt-6 text-lg font-black text-[#06183A]">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

            </Link>

          );
        })}

      </div>

    </div>
  );
}