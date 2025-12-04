"use client";

import Image from "next/image";
import Link from "next/link";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import { useBoka } from "../hooks/useBoka";

interface BokaClientProps {
  tjänster: Tjanst[];
}

export function BokaClient({ tjänster }: BokaClientProps) {
  const { groupedServices, sortedCategories, getImageForService } = useBoka(tjänster);

  if (tjänster.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-stone-50 rounded-xl p-12 border-2 border-dashed border-stone-200">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-stone-800 mb-2">Inga tjänster ännu</h3>
          <p className="text-stone-600">Kontakta administratören för att lägga till tjänster</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedCategories.map((kategori) => (
        <div key={kategori}>
          <h3 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-newsreader)]">
            {kategori}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {groupedServices[kategori].map((tjänst: Tjanst) => (
              <div
                key={tjänst.id}
                className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:border-amber-200 transition-all hover:shadow-md"
              >
                <div className="relative h-32 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={getImageForService(tjänst.namn)}
                    alt={tjänst.namn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!tjänst.aktiv && (
                    <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                      <span className="bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold">
                        Ej tillgänglig
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-800 mb-1 line-clamp-1">
                      {tjänst.namn}
                    </h3>
                    <p className="text-stone-600 text-xs line-clamp-2">
                      {tjänst.beskrivning || "En professionell tjänst anpassad efter dina behov."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-1 text-stone-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs font-medium">{tjänst.varaktighet} min</span>
                    </div>
                    <div className="text-lg font-bold text-amber-700">{tjänst.pris / 100} kr</div>
                  </div>

                  <Link
                    href={tjänst.aktiv ? `/boka/${tjänst.id}` : "#"}
                    className={`block w-full py-2 rounded-md text-sm font-semibold text-center transition-all ${
                      tjänst.aktiv
                        ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    {tjänst.aktiv ? "Boka" : "Ej tillgänglig"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
