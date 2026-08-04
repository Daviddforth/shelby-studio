import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AptosWalletProvider from "../components/wallet/AptosWalletProvider";
import { WalletProvider } from "../context/WalletContext";
import ShelbyProvider from "../context/ShelbyProvider";
import { StorageProvider } from "../context/StorageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelby Studio",
  description:
    "The all-in-one workspace for managing Shelby NFTs, digital assets, storage, and metadata.",
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
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AptosWalletProvider>
          <WalletProvider>
            <ShelbyProvider>
              <StorageProvider>
                {children}
              </StorageProvider>
            </ShelbyProvider>
          </WalletProvider>
        </AptosWalletProvider>
      </body>
    </html>
  );
}