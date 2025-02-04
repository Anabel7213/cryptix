import type { Metadata } from "next";
import { Inter, Mada, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const font = Ubuntu_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cryptix - Password Manager",
  description:
    "Store passwords, cards, and IDs securely. Protected by AES-256 encryption, and Zero-Knowledge architecture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Toaster />
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
