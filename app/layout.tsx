import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
//import { Navbar } from "@/components/layout/Navbar";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { AuthModal } from "@/components/overlays/AuthModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "EBS Premier+ | The Future of Media",
  description: "Next-gen streaming experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} no-scrollbar`}>
      <body className="bg-ebs-dark text-white selection:bg-ebs-crimson selection:text-white">
        
        {children}
        <SearchOverlay />
        <AuthModal />
        
        <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5 mt-20">
            <p>&copy; 2025 EBS Premier+ Technologies. Demo Project.</p>
        </footer>
      </body>
    </html>
  );
}