"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

interface Företag {
  id: string;
  namn: string;
  slug: string;
  beskrivning: string | null;
  stad: string | null;
  adress: string | null;
  telefon: string | null;
  logoUrl: string | null;
}

interface SökResultatProps {
  företag: Företag[];
}

export function SökResultat({ företag }: SökResultatProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {företag.map((f) => (
        <Link
          key={f.id}
          href={`/foretag/${f.slug}`}
          className="bg-white/95 backdrop-blur-md rounded-xl p-6 border border-stone-200 hover:border-amber-500 hover:shadow-xl transition-all group"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-stone-800 group-hover:text-amber-600 transition-colors mb-2">
                {f.namn}
              </h3>
              {f.beskrivning && (
                <p className="text-sm text-stone-600 line-clamp-2">{f.beskrivning}</p>
              )}
            </div>

            <div className="space-y-2">
              {f.stad && (
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-stone-400" />
                  <span>
                    {f.adress && `${f.adress}, `}
                    {f.stad}
                  </span>
                </div>
              )}

              {f.telefon && (
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>{f.telefon}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200">
              <span className="text-amber-600 font-semibold text-sm group-hover:underline">
                Boka tid →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
