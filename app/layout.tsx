import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AptosWalletProvider from "../components/wallet/AptosWalletProvider";

import { ProjectProvider } from "../context/project/ProjectContext";
import { WalletProvider } from "../context/WalletContext";
import { StorageProvider } from "../context/StorageContext";
import { MetadataProvider } from "../context/MetadataContext";
import { CollectionProvider } from "../context/CollectionContext";
import { ActivityProvider } from "../context/ActivityContext";
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
          <ProjectProvider>
            <WalletProvider>
              <StorageProvider>
                <MetadataProvider>
                  <CollectionProvider>
                    <ActivityProvider>
                      <ShelbyProvider>
                        {children}
                      </ShelbyProvider>
                    </ActivityProvider>
                  </CollectionProvider>
                </MetadataProvider>
              </StorageProvider>
            </WalletProvider>
          </ProjectProvider>
        </AptosWalletProvider>
      </body>
    </html>
  );
}