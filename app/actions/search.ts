"use server";

import { db } from "../_server/db";
import { foretag } from "../_server/db/schema/foretag";
import { tjanster } from "../_server/db/schema/tjanster";
import { ilike, or, sql } from "drizzle-orm";

export async function sökForetag(sökterm: string) {
  try {
    if (!sökterm || sökterm.trim().length < 2) {
      return { success: true, data: [] };
    }

    const searchPattern = `%${sökterm.trim()}%`;

    // Sök i företag efter namn, beskrivning eller stad
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
          ilike(foretag.beskrivning, searchPattern),
          ilike(foretag.stad, searchPattern)
        )
      )
      .limit(20);

    // Sök också efter tjänster och gruppera per företag
    const tjänstResultat = await db
      .select({
        foretagsslug: tjanster.foretagsslug,
        kategori: tjanster.kategori,
      })
      .from(tjanster)
      .where(
        or(
          ilike(tjanster.namn, searchPattern),
          ilike(tjanster.beskrivning, searchPattern),
          ilike(tjanster.kategori, searchPattern)
        )
      );

    // Hämta företag för matchande tjänster
    const foretagsSlugs = [...new Set(tjänstResultat.map((t) => t.foretagsslug))];

    if (foretagsSlugs.length > 0) {
      const foretagFranTjanster = await db
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
        .where(sql`${foretag.slug} = ANY(${foretagsSlugs})`);

      // Kombinera och ta bort duplicat
      const allResultat = [...resultat, ...foretagFranTjanster];
      const unikaResultat = Array.from(new Map(allResultat.map((f) => [f.id, f])).values());

      return { success: true, data: unikaResultat };
    }

    return { success: true, data: resultat };
  } catch (error) {
    console.error("Fel vid sökning av företag:", error);
    return { success: false, error: "Kunde inte söka efter företag" };
  }
}
