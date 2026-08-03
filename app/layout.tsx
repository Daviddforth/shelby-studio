import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AptosWalletProvider from "../components/wallet/AptosWalletProvider";
import { WalletProvider } from "../context/WalletContext";
import ShelbyProvider from "../context/ShelbyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelby NFT Metadata Manager",
  description:
    "Create, validate and prepare NFTs for the Shelby ecosystem.",
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
      <body className="min-h-full flex flex-col">
        <AptosWalletProvider>
          <WalletProvider>
            <ShelbyProvider>
              {children}
            </ShelbyProvider>
          </WalletProvider>
        </AptosWalletProvider>
      </body>
    </html>
  );
}