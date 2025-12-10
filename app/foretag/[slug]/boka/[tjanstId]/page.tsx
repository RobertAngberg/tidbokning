import { notFound } from "next/navigation";
import Link from "next/link";
import { BokningPageClient } from "./BokningPageClient";
import {
  hamtaBokningarMedRelationer,
  hamtaTjanstForForetag,
} from "../../../../dashboard/bokningar/actions/bokningar";
import { hamtaAktivaUtforareForForetag } from "../../../../dashboard/utforare/actions/utforare";
import { hamtaLunchtider } from "../../../../dashboard/bokningar/actions/lunchtider";
import { hamtaAllaUtforareTillganglighet } from "../../../../dashboard/utforare/actions/tillganglighet";

interface BokaPageProps {
  params: Promise<{ slug: string; tjanstId: string }>;
}

export default async function BokaTjanstPage({ params }: BokaPageProps) {
  const { slug, tjanstId } = await params;

  // Hämta tjänst för detta företag
  const tjanst = await hamtaTjanstForForetag(tjanstId, slug);

  if (!tjanst) {
    notFound();
  }

  // Hämta bokningar för detta företag
  const foretagBokningar = await hamtaBokningarMedRelationer(slug);

  // Hämta utförare för denna tjänst
  const tjanstUtforare = await hamtaAktivaUtforareForForetag(slug);

  // Hämta lunchtider för företaget
  const lunchtider = await hamtaLunchtider(slug);

  // Hämta utförares tillgänglighet
  const utforareTillganglighet = await hamtaAllaUtforareTillganglighet(slug);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <BokningPageClient
          foretagBokningar={foretagBokningar}
          tjanst={tjanst}
          tjanstUtforare={tjanstUtforare}
          utforareTillganglighet={utforareTillganglighet}
          lunchtider={lunchtider}
          slug={slug}
        />

        {/* Tillbaka-länk */}
        <div className="mt-8">
          <Link
            href={`/foretag/${slug}`}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors text-sm"
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
    </div>
  );
}
