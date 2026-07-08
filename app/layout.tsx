import InstallPWAButton from "@/components/app/InstallPWAButton";
import PWAProvider from "@/components/app/PWAProvider";

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#062B8C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fluidocredit.com"),

  title: {
    default: "Fluido Credit",
    template: "%s | Fluido Credit",
  },

  description:
    "Secure European Digital Banking, IBAN accounts, instant transfers, virtual and physical cards, online loans and modern financial services.",

  applicationName: "Fluido Credit",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: "Fluido Credit",
    statusBarStyle: "default",
  },

  keywords: [
    "Fluido Credit",
    "Digital Banking",
    "Online Banking",
    "European Bank",
    "IBAN",
    "Instant Transfer",
    "Virtual Card",
    "Physical Card",
    "Online Loan",
    "Finance",
    "Bank",
    "Europe",
  ],

  authors: [
    {
      name: "Fluido Credit",
    },
  ],

  creator: "Fluido Credit",

  publisher: "Fluido Credit",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://fluidocredit.com",
  },

  icons: {
    icon: "/alogo.png",
    shortcut: "/alogo.png",
    apple: "/alogo.png",
  },

  openGraph: {
    type: "website",
    url: "https://fluidocredit.com",
    title: "Fluido Credit | European Digital Banking",

    description:
      "Open your secure European bank account online. Instant transfers, IBAN, virtual and physical cards, deposits, withdrawals and online loans.",

    siteName: "Fluido Credit",

    locale: "en_GB",

    images: [
      {
        url: "https://fluidocredit.com/imagefluido.jpeg",
        width: 1200,
        height: 630,
        alt: "Fluido Credit",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Fluido Credit | European Digital Banking",

    description:
      "Secure European banking with IBAN accounts, instant transfers, cards and online loans.",

    creator: "@FluidoCredit",

    images: [
      "https://fluidocredit.com/imagefluido.jpeg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#F5F7FB] text-[#06183A]">
        <PWAProvider />
        <InstallPWAButton />
        {children}
      </body>
    </html>
  );
}