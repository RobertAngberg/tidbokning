import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { hämtaFöretagBySlug } from "../../dashboard/actions/foretag";
import { hämtaTjänsterForFöretag } from "../../dashboard/actions/tjanster";
import { hämtaBilderForFöretag } from "../../dashboard/actions/bilder";

interface ForetagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForetagPage({ params }: ForetagPageProps) {
  const { slug } = await params;

  // Hämta företag
  const foretagData = await hämtaFöretagBySlug(slug);

  if (!foretagData) {
    notFound();
  }

  // Hämta företagets tjänster och bilder
  const [foretagTjanster, foretagBilder] = await Promise.all([
    hämtaTjänsterForFöretag(slug),
    hämtaBilderForFöretag(slug),
  ]);

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
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            href="/sok"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Tillbaka till sök
          </Link>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-3 font-[family-name:var(--font-newsreader)]">
                {foretagData.namn}
              </h1>
              {foretagData.beskrivning && (
                <p className="text-xl text-stone-700 max-w-3xl">{foretagData.beskrivning}</p>
              )}
            </div>

            {/* Bildgalleri */}
            {foretagBilder.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
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

            {/* Kontaktinfo */}
            <div className="flex flex-wrap gap-6 text-stone-600">
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
        </div>
      </div>

      {/* Tjänster Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-stone-900 mb-8">Våra tjänster</h2>

        {Object.entries(tjänsterPerKategori).map(([kategori, tjänsterLista]) => (
          <div key={kategori} className="mb-12">
            <h3 className="text-2xl font-semibold text-stone-800 mb-6 pb-2 border-b-2 border-amber-500">
              {kategori}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tjänsterLista.map((tjanst) => (
                <Link
                  key={tjanst.id}
                  href={`/foretag/${slug}/boka/${tjanst.id}`}
                  className="bg-white rounded-xl p-6 border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors mb-2">
                        {tjanst.namn}
                      </h4>
                      {tjanst.beskrivning && (
                        <p className="text-sm text-stone-600 line-clamp-2">{tjanst.beskrivning}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{tjanst.varaktighet} min</span>
                      </div>
                      <div className="text-lg font-bold text-amber-600">
                        {(tjanst.pris / 100).toFixed(0)} kr
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {foretagTjanster.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p className="text-lg">Inga tjänster tillgängliga för tillfället</p>
          </div>
        )}
      </div>
    </div>
  );
}
