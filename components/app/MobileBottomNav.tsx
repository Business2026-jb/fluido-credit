"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Landmark,
  CreditCard,
  Activity,
  UserRound,
} from "lucide-react";

const items = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Loans", icon: Landmark, href: "/loans/apply" },
  { label: "Cards", icon: CreditCard, href: "/cards" },
  { label: "Activity", icon: Activity, href: "/transactions" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-3 pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                active
                  ? "bg-blue-50 text-[#062B8C]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#06183A]"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={2.4}
                className={active ? "text-[#062B8C]" : "text-slate-500"}
              />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}