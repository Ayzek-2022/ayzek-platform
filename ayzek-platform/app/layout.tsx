import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/contexts/admin-context";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], display: "swap", variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "AYZEK - Community Memory & Event Showcase",
  description: "A modern platform for showcasing community achievements and organizing events",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // DİKKAT: lang'ı "tr" yaptık ve suppressHydrationWarning ekledik
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable} scroll-smooth`}>
      <head>
        <style>{`
          html {
            font-family: ${inter.style.fontFamily};
            --font-sans: ${inter.variable};
            --font-display: ${orbitron.variable};
          }
        `}</style>
      </head>
      <body className="antialiased">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
