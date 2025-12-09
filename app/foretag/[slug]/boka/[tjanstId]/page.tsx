import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { KalenderSchema } from "../../../../dashboard/bokningar/components/KalenderSchema";
import {
  hämtaBokningarMedRelationer,
  hämtaTjänstForFöretag,
} from "../../../../dashboard/bokningar/actions/bokningar";
import { hämtaAktivaUtförareForFöretag } from "../../../../dashboard/utforare/actions/utforare";

interface BokaPageProps {
  params: Promise<{ slug: string; tjanstId: string }>;
}

export default async function BokaTjanstPage({ params }: BokaPageProps) {
  const { slug, tjanstId } = await params;

  // Hämta tjänst för detta företag
  const tjanst = await hämtaTjänstForFöretag(tjanstId, slug);

  if (!tjanst) {
    notFound();
  }

  // Hämta bokningar för detta företag
  const foretagBokningar = await hämtaBokningarMedRelationer(slug);

  // Hämta utförare för denna tjänst
  const tjanstUtforare = await hämtaAktivaUtförareForFöretag(slug);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
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

              {/* Utförare sektion */}
              {tjanstUtforare.length > 0 && (
                <div className="mb-4 pb-4 border-b border-stone-200">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                    Välj Utförare
                  </h3>
                  <div className="space-y-2">
                    {tjanstUtforare.map((u) => (
                      <button
                        key={u.id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
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
                          <p className="text-sm font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                            {u.namn}
                          </p>
                          {u.beskrivning && (
                            <p className="text-xs text-stone-500 truncate">{u.beskrivning}</p>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
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

              {/* Tillbaka-knapp */}
              <Link
                href={`/foretag/${slug}`}
                className="mt-6 pt-4 border-t border-stone-200 inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Tillbaka till företaget
              </Link>
            </div>
          </div>

          {/* Höger kolumn - Kalender (2/3) */}
          <div className="lg:col-span-2">
            <KalenderSchema
              bokningar={foretagBokningar}
              tjanst={tjanst}
              utforare={tjanstUtforare}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
