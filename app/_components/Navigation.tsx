"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Boka en tid" },
    { href: "/bokningar", label: "Bokningar" },
    { href: "/schema", label: "Bokningsschema" },
    { href: "/tjanster", label: "Tjänster" },
  ];

  useEffect(() => {
    updateIndicator();
  }, [pathname]);

  const updateIndicator = () => {
    const activeIndex = links.findIndex((link) => link.href === pathname);
    if (activeIndex !== -1 && navRef.current) {
      const linkElements = navRef.current.querySelectorAll("a");
      const activeLink = linkElements[activeIndex] as HTMLElement;
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = e.currentTarget;
    setIndicatorStyle({
      left: target.offsetLeft,
      width: target.offsetWidth,
    });
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center gap-8 h-16">
          <Link href="/" className="font-bold text-xl">
            Tidbokning
          </Link>
          <div className="relative" ref={navRef}>
            <div className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary active:scale-95 py-1 ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
