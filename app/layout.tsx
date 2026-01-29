import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SimpleNavbar from "./components/simpleNavBar";
import SimpleFooter from "./components/simpleFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio web Aaron Borrego"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`min-h-screen bg-white font-sans text-neutral-900 ${geistSans.variable} ${geistMono.variable}`}
      >
        <SimpleNavbar />
        <div>
          {children}
        </div>
        
        <SimpleFooter />
      </body>
    </html>
  );
}
