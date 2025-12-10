"use client";

import { useState } from "react";
import { KalenderSchema } from "../../../../dashboard/bokningar/components/KalenderSchema";
import Image from "next/image";
import type { Bokning } from "../../../../_server/db/schema/bokningar";
import type { Kund } from "../../../../_server/db/schema/kunder";
import type { Tjanst } from "../../../../_server/db/schema/tjanster";
import type { Utforare } from "../../../../_server/db/schema/utforare";
import type { Lunchtid } from "../../../../_server/db/schema/lunchtider";
import type { UtforareTillganglighet } from "../../../../_server/db/schema/utforare-tillganglighet";

interface BokningPageClientProps {
  foretagBokningar: Array<
    Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }
  >;
  tjanst: Tjanst;
  tjanstUtforare: Utforare[];
  utforareTillganglighet: UtforareTillganglighet[];
  lunchtider: Lunchtid[];
  slug: string;
}

export function BokningPageClient({
  foretagBokningar,
  tjanst,
  tjanstUtforare,
  utforareTillganglighet,
  lunchtider,
  slug,
}: BokningPageClientProps) {
  const [selectedUtforareId, setSelectedUtforareId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Vänster kolumn - Tjänst info (1/3) */}
      <div className="lg:col-span-1 space-y-8">
        {/* Tjänst info */}
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <h1 className="text-2xl font-bold text-stone-800 mb-2 font-[family-name:var(--font-newsreader)]">
            {tjanst.namn}
          </h1>
          <p className="text-stone-600 text-sm mb-4">
            {tjanst.beskrivning || "En professionell tjänst anpassad efter dina behov."}
          </p>

          {/* Utförare sektion med radio buttons */}
          {tjanstUtforare.length > 0 && (
            <div className="mb-4 pb-4 border-b border-stone-200">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                Filtrera på Utförare
              </h3>
              <div className="space-y-2">
                {/* Alla utförare */}
                <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="utforare"
                    checked={selectedUtforareId === null}
                    onChange={() => setSelectedUtforareId(null)}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-semibold text-stone-800">Alla utförare</span>
                </label>

                {/* Varje utförare */}
                {tjanstUtforare.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="utforare"
                      checked={selectedUtforareId === u.id}
                      onChange={() => setSelectedUtforareId(u.id)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
                      <Image
                        src={
                          u.bildUrl ||
                          "https://api.dicebear.com/7.x/avataaars/png?seed=default&size=96"
                        }
                        alt={u.namn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{u.namn}</p>
                      {u.beskrivning && (
                        <p className="text-xs text-stone-500 truncate">{u.beskrivning}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{tjanst.varaktighet} minuter</span>
            </div>
            <div className="text-2xl font-bold text-amber-700">{tjanst.pris / 100} kr</div>
          </div>
        </div>
      </div>

      {/* Höger kolumn - Kalender (2/3) */}
      <div className="lg:col-span-2">
        <KalenderSchema
          bokningar={foretagBokningar}
          tjanst={tjanst}
          utforare={tjanstUtforare}
          utforareTillganglighet={utforareTillganglighet}
          lunchtider={lunchtider}
          foretagsslug={slug}
          selectedUtforareId={selectedUtforareId}
        />
      </div>
    </div>
  );
}
