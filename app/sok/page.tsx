import { sökForetag } from "./actions/search";
import { SokResultat } from "./components/SokResultat";
import Link from "next/link";

interface SökPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SökPage({ searchParams }: SökPageProps) {
  const params = await searchParams;
  const sökterm = params.q || "";
  const resultat = sökterm ? await sökForetag(sökterm) : { success: true, data: [] };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Tillbaka till startsidan
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-newsreader)]">
            Sökresultat
          </h1>
          {sökterm && (
            <p className="text-xl text-white/80">
              Visar resultat för <span className="font-semibold">&ldquo;{sökterm}&rdquo;</span>
            </p>
          )}
        </div>

        {!sökterm ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <p className="text-white/80 text-lg">Ange en sökterm för att hitta företag</p>
          </div>
        ) : resultat.success && resultat.data && resultat.data.length > 0 ? (
          <SokResultat foretag={resultat.data} sokterm={sökterm} />
        ) : resultat.success ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">Inga resultat hittades</h2>
            <p className="text-white/80">
              Vi kunde inte hitta några företag som matchar &ldquo;{sökterm}&rdquo;
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
            >
              Tillbaka till startsidan
            </Link>
          </div>
        ) : (
          <div className="bg-red-500/10 backdrop-blur-md rounded-xl p-8 border border-red-500/20 text-center">
            <p className="text-white">Ett fel uppstod vid sökningen. Försök igen senare.</p>
          </div>
        )}
      </div>
    </div>
  );
}
