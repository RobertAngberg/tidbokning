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
