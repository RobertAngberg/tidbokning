"use server";

import { db } from "../../_server/db";
import { utforare, utforareTjanster } from "../../_server/db/schema/utforare";
import type { Utforare } from "../../_server/db/schema/utforare";
import { eq } from "drizzle-orm";

export async function hämtaUtförareForTjänst(tjanstId: string): Promise<Utforare[]> {
  try {
    // Hämta alla kopplingar för denna tjänst
    const kopplingar = await db.query.utforareTjanster.findMany({
      where: eq(utforareTjanster.tjanstId, tjanstId),
      with: {
        utforare: true,
      },
    });

    // Filtrera ut aktiva utförare
    return kopplingar.map((k) => k.utforare).filter((u) => u.aktiv);
  } catch (error) {
    console.error("Fel vid hämtning av utförare:", error);
    return [];
  }
}
