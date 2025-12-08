"use server";

import { db } from "../../_server/db";
import { foretag } from "../../_server/db/schema/foretag";
import { tjanster } from "../../_server/db/schema/tjanster";
import { ilike, or, inArray } from "drizzle-orm";

export async function sökForetag(sökterm: string) {
  try {
    console.log("🔍 Söker efter:", sökterm);

    if (!sökterm || sökterm.trim().length < 2) {
      return { success: true, data: [] };
    }

    const searchPattern = `%${sökterm.trim()}%`;
    console.log("🔍 Sökmönster:", searchPattern);

    // Sök först efter tjänster med matchande namn, beskrivning eller kategori
    const tjänstResultat = await db
      .select({
        foretagsslug: tjanster.foretagsslug,
      })
      .from(tjanster)
      .where(
        or(
          ilike(tjanster.namn, searchPattern),
          ilike(tjanster.beskrivning, searchPattern),
          ilike(tjanster.kategori, searchPattern)
        )
      );

    console.log("🔍 Hittade tjänster:", tjänstResultat.length);
    console.log("🔍 Tjänster:", tjänstResultat);

    // Samla alla unika företagsslug från tjänstresultaten
    const foretagsSlugsFromTjanster = [...new Set(tjänstResultat.map((t) => t.foretagsslug))];
    console.log("🔍 Företagsslugs från tjänster:", foretagsSlugsFromTjanster);

    // Sök i företag efter namn, slug, beskrivning eller stad
    // OCH inkludera företag vars slug finns i tjänstresultaten
    const resultat = await db
      .select({
        id: foretag.id,
        namn: foretag.namn,
        slug: foretag.slug,
        beskrivning: foretag.beskrivning,
        stad: foretag.stad,
        adress: foretag.adress,
        telefon: foretag.telefon,
        logoUrl: foretag.logoUrl,
      })
      .from(foretag)
      .where(
        or(
          ilike(foretag.namn, searchPattern),
          ilike(foretag.slug, searchPattern),
          ilike(foretag.beskrivning, searchPattern),
          ilike(foretag.stad, searchPattern),
          foretagsSlugsFromTjanster.length > 0
            ? inArray(foretag.slug, foretagsSlugsFromTjanster)
            : undefined
        )
      )
      .limit(20);

    console.log("🔍 Hittade företag:", resultat.length);
    console.log("🔍 Företag:", resultat);

    return { success: true, data: resultat };
  } catch (error) {
    console.error("❌ Fel vid sökning av företag:", error);
    return { success: false, error: "Kunde inte söka efter företag" };
  }
}
