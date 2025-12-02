import type { Metadata } from "next";
import { Lato, Newsreader } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./_lib/providers";
import { Navigation } from "./_components/Navigation";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Tidbokning - Boka dina tider enkelt",
  description: "Ett modernt tidsbokningssystem för företag och kunder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${lato.className} ${newsreader.variable}`}>
        <QueryProvider>
          <Navigation />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
