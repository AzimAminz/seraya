import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const text = Montserrat({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Seraya",
  description:
    "Tudung pastel dari Kuala Lumpur dalam tujuh warna yang diambil dari hutan. Chiffon, satin dan jersi dari RM59.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ms" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
