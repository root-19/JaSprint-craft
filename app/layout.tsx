import type { Metadata } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const sans = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JaSprint & Craft | Custom Printing & Souvenirs",
  description:
    "Custom t-shirt printing, mugs, tumblers, caps, tote bags and personalized souvenirs. Heat press & sublimation, from 1 piece.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
