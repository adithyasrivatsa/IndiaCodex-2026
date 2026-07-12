import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@meshsdk/react/styles.css";
import MeshProviderWrapper from "@/components/providers/MeshProviderWrapper";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdaCompute — Decentralized AI Service Exchange on Cardano",
  description:
    "Discover, purchase, and use AI services with ADA. A decentralized marketplace for AI models powered by Cardano blockchain. Trustless payments, on-chain reputation, and escrow-protected transactions.",
  keywords: ["AI", "Cardano", "ADA", "marketplace", "decentralized", "machine learning", "blockchain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <MeshProviderWrapper>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </MeshProviderWrapper>
      </body>
    </html>
  );
}
