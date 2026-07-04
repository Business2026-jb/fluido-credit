import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://fluidocredit.com"),

  title: {
    default: "Fluido Credit",
    template: "%s | Fluido Credit",
  },

  description:
    "Fluido Credit is a secure European digital banking and online lending platform.",

  applicationName: "Fluido Credit",

  keywords: [
    "Fluido Credit",
    "Digital Banking",
    "Online Loan",
    "European Bank",
    "Finance",
    "Credit",
    "Personal Loan",
  ],

  authors: [
    {
      name: "Fluido Credit",
    },
  ],

  creator: "Fluido Credit",

  publisher: "Fluido Credit",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "Fluido Credit",
    description:
      "European Digital Banking and Online Lending Platform.",
    siteName: "Fluido Credit",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Fluido Credit",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fluido Credit",
    description:
      "European Digital Banking and Online Lending Platform.",
    images: ["/favicon.png"],
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
        {children}
      </body>
    </html>
  );
}