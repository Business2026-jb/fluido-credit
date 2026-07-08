"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  X,
  UserCircle2,
  LayoutDashboard,
  Landmark,
  CreditCard,
  ArrowLeftRight,
  LifeBuoy,
  ShieldCheck,
  FileText,
  Scale,
  LogOut,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Loans", href: "/loans/apply", icon: Landmark },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const mobileMenu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Loans", href: "/loans/apply", icon: Landmark },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Support", href: "/support", icon: LifeBuoy },
  { name: "Privacy", href: "/privacy", icon: ShieldCheck },
  { name: "Terms", href: "/terms", icon: FileText },
  { name: "Legal", href: "/legal", icon: Scale },
  { name: "Logout", href: "https://fluidocredit.com/api/auth/logout", icon: LogOut },
];

export default function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/alogo.png"
            alt="Fluido Credit"
            width={170}
            height={56}
            priority
            className="h-12 w-auto object-contain"
          />

          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-[#06183A]">
              Fluido Credit
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              European Digital Banking
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  active
                    ? "bg-blue-50 text-[#062B8C]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#06183A]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[#06183A] transition hover:bg-slate-200 md:flex"
          >
            <Search size={20} />
          </button>

          <Link
            href="/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[#06183A] transition hover:bg-slate-200"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </Link>

          <Link
            href="/settings"
            className={`hidden items-center gap-2 rounded-2xl px-3 py-2 transition md:flex ${
              pathname === "/settings"
                ? "bg-blue-50 text-[#062B8C]"
                : "bg-slate-100 text-[#06183A] hover:bg-slate-200"
            }`}
          >
            <Settings size={22} />
            <span className="hidden text-sm font-black lg:block">
              Settings
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-[#06183A] transition hover:bg-slate-200"
          >
            <UserCircle2 size={30} />
            <span className="hidden text-sm font-black lg:block">
              My Profile
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[#06183A] lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            {mobileMenu.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-black transition ${
                    active
                      ? "bg-blue-50 text-[#062B8C]"
                      : "bg-slate-50 text-[#06183A] hover:bg-blue-50 hover:text-[#062B8C]"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}