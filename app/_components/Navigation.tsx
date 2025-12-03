"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [clickedPath, setClickedPath] = useState<string | null>(null);

  const links = [
    { href: "/", label: "Boka en tid" },
    { href: "/bokningar", label: "Bokningar" },
    { href: "/kalender", label: "Kalender" },
    { href: "/tjanster", label: "Tjänster" },
  ];

  const activePath = clickedPath || pathname;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center gap-8 h-16">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 mr-12">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-cyan-500"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
              <path d="M8 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="12" cy="15" r="1" fill="currentColor" />
              <circle cx="16" cy="15" r="1" fill="currentColor" />
            </svg>
            Tidbokning
          </Link>
          <div className="flex items-center" ref={navRef}>
            <div className="flex gap-8 items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setClickedPath(link.href)}
                  className={`text-lg transition-all duration-300 font-[family-name:var(--font-newsreader)] leading-none flex items-center ${
                    activePath === link.href
                      ? "text-white font-bold bg-cyan-500 px-4 py-2 rounded-full hover:text-white"
                      : "text-muted-foreground font-medium hover:text-cyan-500"
                  }`}
                >
                  <span className="translate-y-0.5">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
