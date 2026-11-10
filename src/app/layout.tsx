import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beyanco AI — Architectural Interior Transformation & Virtual Staging",
  description:
    "Upload an empty room, get it furnished by AI, and buy the exact furniture you see. Join the Beyanco AI waitlist.",
  keywords: [
    "virtual staging",
    "architectural visualization",
    "AI interior design",
    "property photography",
    "real estate staging",
    "interior architecture",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="font-sans min-h-screen bg-[#F6F4EF] text-[#101827] antialiased selection:bg-[#A98460]/20 selection:text-[#101827]">
        {children}
      </body>
    </html>
  );
}
