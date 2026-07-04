import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  MessageCircle,
  LockKeyhole,
  Landmark,
} from "lucide-react";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Fluido Credit"
              width={48}
              height={48}
              className="rounded-xl"
            />

            <div>
              <h2 className="text-lg font-black text-[#06183A]">
                Fluido Credit
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                European Digital Banking
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
            Secure online banking, lending, virtual cards and customer
            verification services for modern digital finance.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              <ShieldCheck size={15} />
              Secure platform
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-[#062B8C]">
              <Landmark size={15} />
              Digital banking
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#06183A]">
            Banking
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <Link href="/dashboard" className="hover:text-[#062B8C]">
              Dashboard
            </Link>
            <Link href="/accounts" className="hover:text-[#062B8C]">
              Accounts
            </Link>
            <Link href="/cards" className="hover:text-[#062B8C]">
              Cards
            </Link>
            <Link href="/transactions" className="hover:text-[#062B8C]">
              Transactions
            </Link>
            <Link href="/withdraw" className="hover:text-[#062B8C]">
              Withdrawals
            </Link>
            <Link href="/transfers" className="hover:text-[#062B8C]">
              Transfers
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#06183A]">
            Services
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <Link href="/loans" className="hover:text-[#062B8C]">
              Loans
            </Link>
            <Link href="/documents" className="hover:text-[#062B8C]">
              KYC Verification
            </Link>
            <Link href="/profile" className="hover:text-[#062B8C]">
              Profile
            </Link>
            <Link href="/notifications" className="hover:text-[#062B8C]">
              Notifications
            </Link>
            <Link href="/support" className="hover:text-[#062B8C]">
              Support
            </Link>
            <Link href="/security" className="hover:text-[#062B8C]">
              Security
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#06183A]">
            Contact
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <a
              href="mailto:contact@fluidocredit.com"
              className="flex items-center gap-2 hover:text-[#062B8C]"
            >
              <Mail size={17} />
              contact@fluidocredit.com
            </a>

            <a
              href="https://wa.me/33757750473"
              target="_blank"
              className="flex items-center gap-2 hover:text-emerald-600"
            >
              <MessageCircle size={17} />
              WhatsApp France
            </a>

            <a
              href="https://wa.me/491771350350"
              target="_blank"
              className="flex items-center gap-2 hover:text-emerald-600"
            >
              <MessageCircle size={17} />
              WhatsApp Germany
            </a>

            <p className="flex items-center gap-2 text-slate-500">
              <LockKeyhole size={17} />
              Never share your password or CVV.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-5 text-sm text-slate-500 md:flex-row md:px-8">
          <p>© {year} Fluido Credit. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-[#062B8C]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#062B8C]">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#062B8C]">
              Cookies
            </Link>
            <Link href="/security" className="hover:text-[#062B8C]">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}