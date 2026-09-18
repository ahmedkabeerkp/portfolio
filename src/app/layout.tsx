import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import CustomCursor from "@/components/motion/CustomCursor";
import MouseTrail from "@/components/motion/MouseTrail";


const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});



export const metadata: Metadata = {
  title: "Ahmed Kabeer — Application Developer",
  description:
    "Application developer building systems that scale, adapt, and perform. Flutter, Firebase, and full-stack web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <CustomCursor />
        <MouseTrail />
      </body>
    </html>
  );
}
