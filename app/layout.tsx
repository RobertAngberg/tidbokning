import type { Metadata } from "next";
import { Nunito, Newsreader } from "next/font/google";
import "./globals.css";
import { Navigation } from "./_components/Navigation";
import Image from "next/image";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Tidbokning - Boka dina tider enkelt",
  description: "Ett modernt tidsbokningssystem for foretag och kunder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${nunito.className} ${newsreader.variable}`}>
        {/* Global bakgrundsbild */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?fm=jpg&q=100&fit=max&w=3840"
            alt="Abstrakt naturbakgrund"
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
          />
          <div className="absolute inset-0 backdrop-blur-xl" />
        </div>

        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
