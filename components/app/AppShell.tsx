"use client";

import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import MobileBottomNav from "./MobileBottomNav";
import AppFooter from "./AppFooter";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <AppHeader />

      <main className="pt-20 pb-24 md:pb-10">
        {children}
      </main>

      <div className="hidden md:block">
        <AppFooter />
      </div>

      <MobileBottomNav />
    </div>
  );
}