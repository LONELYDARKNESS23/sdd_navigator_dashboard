import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ThemeToggle from "@/components/theme-toggle";
import { getThemeInitScript } from "@/lib/theme";

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
  title: "SDD Navigator Dashboard",
  description: "Traceability coverage dashboard for the SDD Navigator take-home assignment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      data-theme="dark"
    >
      <body
        suppressHydrationWarning
        className="dark flex min-h-full flex-col"
        data-theme="dark"
      >
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <div className="mx-auto flex w-full max-w-6xl justify-end px-6 pt-4">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
