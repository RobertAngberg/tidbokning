import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, Clock, Star } from "lucide-react";
import { hamtaForetagBySlug } from "../../dashboard/foretagsuppgifter/actions/foretag";
import { hamtaTjansterForForetag } from "../../dashboard/tjanster/actions/tjanster";
import { hamtaBilderForForetag } from "../../dashboard/bilder/actions/bilder";
import { hamtaOppettiderForForetag } from "../../dashboard/oppettider/actions/oppettider";
import { hamtaRecensioner, hamtaSnittbetyg } from "../../dashboard/recensioner/actions/recensioner";
import { RecensionsFormular } from "./components/RecensionsFormular";

interface ForetagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForetagPage({ params }: ForetagPageProps) {
  const { slug } = await params;

  // Hämta företag
  const foretagData = await hamtaForetagBySlug(slug);

  if (!foretagData) {
    notFound();
  }

  // Hämta företagets tjänster, bilder, öppettider och recensioner
  const [foretagTjanster, foretagBilder, foretagOppettiderData, recensioner, snittbetyg] =
    await Promise.all([
      hamtaTjansterForForetag(slug),
      hamtaBilderForForetag(slug),
      hamtaOppettiderForForetag(slug),
      hamtaRecensioner(slug),
      hamtaSnittbetyg(slug),
    ]);

  // Definiera alla veckodagar med default-värden
  const ALLA_VECKODAGAR = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

  // Skapa en komplett lista med alla veckodagar (använd sparad data eller default)
  const foretagOppettider = ALLA_VECKODAGAR.map((dag) => {
    const sparadOppettid = foretagOppettiderData.find((o) => o.veckodag === dag);
    const arVardag = !["lördag", "söndag"].includes(dag);
    return (
      sparadOppettid || {
        id: dag,
        veckodag: dag,
        oppnar: "08:00",
        stanger: "17:00",
        stangt: !arVardag,
        foretagsslug: slug,
      }
    );
  });

  // Gruppera tjänster per kategori
  const tjänsterPerKategori = foretagTjanster.reduce((acc, tjanst) => {
    const kategori = tjanst.kategori || "Övrigt";
    if (!acc[kategori]) acc[kategori] = [];
    acc[kategori].push(tjanst);
    return acc;
  }, {} as Record<string, typeof foretagTjanster>);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-3 font-[family-name:var(--font-newsreader)]">
                {foretagData.namn}
              </h1>
              {foretagData.beskrivning && (
                <p className="text-base text-stone-600 max-w-3xl">{foretagData.beskrivning}</p>
              )}

              {/* Kontaktinfo */}
              <div className="flex flex-wrap gap-6 text-stone-600 mt-6">
                {foretagData.adress && foretagData.stad && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span>
                      {foretagData.adress}, {foretagData.stad}
                    </span>
                  </div>
                )}
                {foretagData.telefon && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <a href={`tel:${foretagData.telefon}`} className="hover:text-amber-600">
                      {foretagData.telefon}
                    </a>
                  </div>
                )}
                {foretagData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <a href={`mailto:${foretagData.email}`} className="hover:text-amber-600">
                      {foretagData.email}
                    </a>
                  </div>
                )}
                {foretagData.webbplats && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-600" />
                    <a
                      href={foretagData.webbplats}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600"
                    >
                      Besök hemsida
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bildgalleri */}
            {foretagBilder.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {foretagBilder.map((bild) => (
                  <div
                    key={bild.id}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={bild.bildUrl}
                      alt={bild.beskrivning || "Företagsbild"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Vänster kolumn: Karta */}
              <div className="lg:col-span-2 space-y-8">
                {/* Karta */}
                {foretagData.adress && foretagData.stad && (
                  <div className="rounded-lg border border-stone-200 shadow-sm overflow-hidden h-[300px]">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${foretagData.adress}, ${foretagData.stad}`
                      )}&output=embed&hl=sv&z=15`}
                      width="100%"
                      height="100%"
                      className="rounded-lg"
                      loading="lazy"
                      title="Företagets plats"
                      style={{ border: 0 }}
                    />
                  </div>
                )}
              </div>

              {/* Höger kolumn: Öppettider */}
              {foretagOppettider.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-stone-900">Öppettider</h2>
                  <div className="space-y-2.5">
                    {foretagOppettider.map((oppettid) => (
                      <div key={oppettid.id} className="flex justify-between text-base">
                        <span className="font-medium capitalize text-stone-700">
                          {oppettid.veckodag}
                        </span>
                        <span className="text-stone-600">
                          {oppettid.stangt
                            ? "Stängt"
                            : `${oppettid.oppnar?.substring(0, 5)} - ${oppettid.stanger?.substring(
                                0,
                                5
                              )}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tjänster Section */}
          {foretagTjanster.length > 0 && (
            <div className="space-y-6 mt-8 pb-12">
              <div>
                <h2 className="text-3xl font-bold text-stone-900 mb-3">Våra tjänster</h2>
                <hr className="border-stone-300" />
              </div>

              {Object.entries(tjänsterPerKategori).map(([kategori, tjänsterLista]) => (
                <div key={kategori} className="space-y-4">
                  <h3 className="text-xl font-semibold text-stone-800">{kategori}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {tjänsterLista.map((tjanst) => (
                      <Link
                        key={tjanst.id}
                        href={`/foretag/${slug}/boka/${tjanst.id}`}
                        className="flex flex-col bg-white rounded-xl p-6 shadow-sm border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all group h-full"
                      >
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-stone-900 group-hover:text-amber-600 transition-colors mb-2">
                            {tjanst.namn}
                          </h4>
                          {tjanst.beskrivning && (
                            <p className="text-sm text-stone-600 line-clamp-2 mb-4">
                              {tjanst.beskrivning}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-stone-100">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-stone-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{tjanst.varaktighet} min</span>
                            </div>
                            <div className="text-xl font-bold text-amber-600">
                              {(tjanst.pris / 100).toFixed(0)} kr
                            </div>
                          </div>
                          <button className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
                            Boka
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recensioner Section */}
          <div className="space-y-6 mt-12 pb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-stone-900 mb-2">Recensioner</h2>
                {snittbetyg !== null && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(snittbetyg)
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-stone-700">
                      {snittbetyg.toFixed(1)}
                    </span>
                    <span className="text-stone-500">
                      ({recensioner.length} {recensioner.length === 1 ? "recension" : "recensioner"}
                      )
                    </span>
                  </div>
                )}
              </div>
            </div>

            {recensioner.length === 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
                  <p className="text-stone-500 mb-4">
                    Inga recensioner ännu. Bli den första att recensera!
                  </p>
                </div>
                <RecensionsFormular foretagsslug={slug} />
              </div>
            ) : (
              <div className="space-y-4">
                <RecensionsFormular foretagsslug={slug} />
                {recensioner.map((recension) => (
                  <div
                    key={recension.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-stone-900">
                          {recension.kund?.namn || "Anonym"}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < recension.betyg
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-stone-500">
                        {new Date(recension.skapadDatum).toLocaleDateString("sv-SE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    {recension.kommentar && (
                      <p className="text-stone-700 leading-relaxed">{recension.kommentar}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
