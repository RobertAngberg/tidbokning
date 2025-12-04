"use client";

import Image from "next/image";
import Link from "next/link";
import type { Tjanst } from "../../_server/db/schema/tjanster";
import { useBoka } from "../hooks/useBoka";

interface BokaClientProps {
  tjänster: Tjanst[];
}

export function BokaClient({ tjänster }: BokaClientProps) {
  const { groupedServices, sortedCategories } = useBoka(tjänster);

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
      {/* Massage bilder */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80"
            alt="Massage behandling"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80"
            alt="Spa och avkoppling"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop&q=80"
            alt="Wellness behandling"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {sortedCategories.map((kategori) => (
        <div key={kategori}>
          <h3 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-newsreader)]">
            {kategori}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedServices[kategori].map((tjänst: Tjanst) => (
              <div
                key={tjänst.id}
                className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:border-amber-200 transition-all hover:shadow-md"
              >
                <div className="p-5 space-y-3 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{tjänst.namn}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {tjänst.beskrivning || "En professionell tjänst anpassad efter dina behov."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <svg
                        className="w-5 h-5"
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
                      <span className="text-sm font-medium">{tjänst.varaktighet} min</span>
                    </div>
                    <div className="text-xl font-bold text-amber-700">{tjänst.pris / 100} kr</div>
                  </div>

                  <Link
                    href={tjänst.aktiv ? `/boka/${tjänst.id}` : "#"}
                    className={`block w-full py-2.5 rounded-md text-sm font-semibold text-center transition-all ${
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
