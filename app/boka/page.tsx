import { hämtaBokningar, hämtaTjänster } from "../bokningar/actions/bokningar";
import { KalenderSchema } from "../kalender/components/KalenderSchema";
import type { Tjanst } from "../_server/db/schema/tjanster";
import Image from "next/image";

export default async function BokaPage() {
  const [bokningar, tjänster] = await Promise.all([hämtaBokningar(), hämtaTjänster()]);

  const serviceImages: Record<string, string> = {
    massage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    konsultation:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    träning: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    klippning: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop",
    frisör: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
    default: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=600&h=400&fit=crop",
  };

  const getImageForService = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("massage")) return serviceImages.massage;
    if (lowerName.includes("konsultation")) return serviceImages.konsultation;
    if (lowerName.includes("träning") || lowerName.includes("pt")) return serviceImages.träning;
    if (lowerName.includes("klippning") || lowerName.includes("hår"))
      return serviceImages.klippning;
    if (lowerName.includes("frisör")) return serviceImages.frisör;
    return serviceImages.default;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Kalender sektion */}
        <section>
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-6xl text-white font-[family-name:var(--font-newsreader)]">Boka</h1>
            <p className="text-xl text-white font-[family-name:var(--font-newsreader)]">
              Se lediga tider och välj en tjänst
            </p>
          </div>
          <KalenderSchema bokningar={bokningar} />
        </section>

        {/* Tjänster sektion */}
        <section>
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-4xl text-white font-[family-name:var(--font-newsreader)]">
              Våra Tjänster
            </h2>
            <p className="text-lg text-white/90 font-[family-name:var(--font-newsreader)]">
              Utforska vårt utbud av professionella tjänster
            </p>
          </div>

          {tjänster.length === 0 ? (
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
                <p className="text-stone-600">
                  Kontakta administratören för att lägga till tjänster
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tjänster.map((tjänst: Tjanst) => (
                <div
                  key={tjänst.id}
                  className="group bg-white rounded-xl overflow-hidden border-2 border-stone-200 hover:border-amber-200 transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={getImageForService(tjänst.namn)}
                      alt={tjänst.namn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!tjänst.aktiv && (
                      <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                        <span className="bg-stone-800 text-white px-4 py-2 rounded-lg font-semibold">
                          Ej tillgänglig
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">{tjänst.namn}</h3>
                      <p className="text-stone-600 text-sm line-clamp-2">
                        {tjänst.beskrivning || "En professionell tjänst anpassad efter dina behov."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div className="flex items-center gap-2 text-stone-600">
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
                      <div className="text-2xl font-bold text-amber-700">
                        {tjänst.pris / 100} kr
                      </div>
                    </div>

                    <button
                      disabled={!tjänst.aktiv}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        tjänst.aktiv
                          ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                          : "bg-stone-200 text-stone-400 cursor-not-allowed"
                      }`}
                    >
                      {tjänst.aktiv ? "Boka nu" : "Ej tillgänglig"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-8 border border-amber-200 mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-800 mb-2">
                  Behöver du hjälp med att välja?
                </h3>
                <p className="text-stone-600">
                  Kontakta oss gärna så hjälper vi dig att hitta rätt tjänst för dina behov. Alla
                  priser är inklusive moms och du kan alltid avboka kostnadsfritt upp till 24 timmar
                  innan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
