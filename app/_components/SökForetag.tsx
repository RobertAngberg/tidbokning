"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SökForetag() {
  const [sökterm, setSökterm] = useState("");
  const router = useRouter();

  const handleSök = (e: React.FormEvent) => {
    e.preventDefault();
    if (sökterm.trim()) {
      router.push(`/sok?q=${encodeURIComponent(sökterm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSök} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={sökterm}
          onChange={(e) => setSökterm(e.target.value)}
          placeholder="Sök efter företag, tjänster eller behandlingar..."
          className="w-full px-6 py-4 pr-14 text-lg rounded-full bg-white/95 backdrop-blur-md border-2 border-white/20 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
