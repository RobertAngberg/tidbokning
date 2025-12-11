"use server";

import { db } from "../../../_server/db";
import { utforareTillganglighet } from "../../../_server/db/schema/utforare-tillganglighet";
import { eq } from "drizzle-orm";

export async function hamtaUtforareTillganglighet(utforareId: string) {
  return await db
    .select()
    .from(utforareTillganglighet)
    .where(eq(utforareTillganglighet.utforareId, utforareId));
}

export async function hamtaAllaUtforareTillganglighet(foretagsslug: string) {
  // Hämta alla utförares tillgänglighet för ett företag
  // Detta kräver en join med utforare-tabellen för att filtrera på företag
  const { utforare } = await import("../../../_server/db/schema/utforare");

  return await db
    .select({
      id: utforareTillganglighet.id,
      utforareId: utforareTillganglighet.utforareId,
      veckodag: utforareTillganglighet.veckodag,
      startTid: utforareTillganglighet.startTid,
      slutTid: utforareTillganglighet.slutTid,
      ledig: utforareTillganglighet.ledig,
    })
    .from(utforareTillganglighet)
    .innerJoin(utforare, eq(utforareTillganglighet.utforareId, utforare.id))
    .where(eq(utforare.foretagsslug, foretagsslug));
}

export async function sparaTillganglighet(data: {
  utforareId: string;
  tillganglighet: Array<{
    veckodag: string;
    ledig: boolean;
    startTid?: string;
    slutTid?: string;
  }>;
}) {
  try {
    // Radera befintlig tillgänglighet för denna utförare
    await db
      .delete(utforareTillganglighet)
      .where(eq(utforareTillganglighet.utforareId, data.utforareId));

    // Lägg till ny tillgänglighet
    if (data.tillganglighet.length > 0) {
      await db.insert(utforareTillganglighet).values(
        data.tillganglighet.map((t) => ({
          utforareId: data.utforareId,
          veckodag: t.veckodag,
          ledig: t.ledig,
          startTid: !t.ledig && t.startTid ? t.startTid : null,
          slutTid: !t.ledig && t.slutTid ? t.slutTid : null,
        }))
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Fel vid sparande av tillgänglighet:", error);
    return { success: false, error: "Kunde inte spara tillgänglighet" };
  }
}
