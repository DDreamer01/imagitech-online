import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "†hε drεαmεr | Infrastructure, Security & Automation",
    template: "%s | †hε drεαmεr",
  },
  description: "Personal website, technical blog, and documentation library of †hε drεαmεr. Focused on Linux, cloud infrastructure, networking, VPNs, Python, and self-hosting.",
  metadataBase: new URL("https://imagitech.online"),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "†hε drεαmεr | Infrastructure, Security & Automation",
    description: "Personal website, technical blog, and documentation library of †hε drεαmεr.",
    url: "https://imagitech.online",
    siteName: "†hε drεαmεr's Notebook",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-sky-400 focus:border focus:border-slate-800 focus:rounded-md focus:outline-none"
        >
          Skip to content
        </a>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
