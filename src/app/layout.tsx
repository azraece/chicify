import type { Metadata } from "next";
import { Inter, Alex_Brush } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const alexBrush = Alex_Brush({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-alex-brush'
});

export const metadata: Metadata = {
  title: "Chicify - İlham Veren Tasarımlar",
  description: "Moda, tasarım ve ilham veren içerikler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} ${alexBrush.variable}`}>{children}</body>
    </html>
  );
}
