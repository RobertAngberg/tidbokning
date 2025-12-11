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
import { hamtaOppettiderForForetag } from "../../../../dashboard/oppettider/actions/oppettider";

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

  // Hämta öppettider
  const oppettiderArray = await hamtaOppettiderForForetag(slug);

  // Konvertera öppettider till format som kalendern förstår
  const oppettider = oppettiderArray.reduce((acc, o) => {
    acc[o.veckodag] = {
      open: o.oppnar ? o.oppnar.substring(0, 5) : "08:00", // "HH:MM:SS" -> "HH:MM"
      close: o.stanger ? o.stanger.substring(0, 5) : "17:00", // "HH:MM:SS" -> "HH:MM"
      stangt: o.stangt,
      lunchStart: o.lunchStart || null,
      lunchSlut: o.lunchSlut || null,
    };
    return acc;
  }, {} as { [key: string]: { open: string; close: string; stangt: boolean; lunchStart: string | null; lunchSlut: string | null } });

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
          oppettider={oppettider}
        />
      </div>
    </div>
  );
}
