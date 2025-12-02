"use server";

import { db } from "../db";
import { bokningar } from "../db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function hämtaStatistik(foretagsslug: string = "demo") {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total bokningar
    const [totalaBokningar] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bokningar)
      .where(eq(bokningar.foretagsslug, foretagsslug));

    // Bokningar denna vecka
    const [bokningarDennaVecka] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bokningar)
      .where(
        and(eq(bokningar.foretagsslug, foretagsslug), gte(bokningar.skapadDatum, startOfWeek))
      );

    // Bokningar denna månad
    const [bokningarDennaMånad] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bokningar)
      .where(
        and(eq(bokningar.foretagsslug, foretagsslug), gte(bokningar.skapadDatum, startOfMonth))
      );

    // Bekräftade bokningar
    const [bekraftadeBokningar] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bokningar)
      .where(and(eq(bokningar.foretagsslug, foretagsslug), eq(bokningar.status, "bekraftad")));

    // Mest populära tjänster
    const popularaTjanster = await db
      .select({
        tjanstId: bokningar.tjanstId,
        count: sql<number>`count(*)`,
      })
      .from(bokningar)
      .where(eq(bokningar.foretagsslug, foretagsslug))
      .groupBy(bokningar.tjanstId)
      .limit(5);

    return {
      totalaBokningar: Number(totalaBokningar?.count || 0),
      bokningarDennaVecka: Number(bokningarDennaVecka?.count || 0),
      bokningarDennaMånad: Number(bokningarDennaMånad?.count || 0),
      bekraftadeBokningar: Number(bekraftadeBokningar?.count || 0),
      popularaTjanster,
    };
  } catch (error) {
    console.error("Fel vid hämtning av statistik:", error);
    return {
      totalaBokningar: 0,
      bokningarDennaVecka: 0,
      bokningarDennaMånad: 0,
      bekraftadeBokningar: 0,
      popularaTjanster: [],
    };
  }
}
