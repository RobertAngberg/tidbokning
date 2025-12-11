"use server";

import { db } from "../../../_server/db";
import { kunder } from "../../../_server/db/schema/kunder";
import { bokningar } from "../../../_server/db/schema/bokningar";
import { eq, desc, count, sql } from "drizzle-orm";
import { auth } from "../../../_server/auth";
import { headers } from "next/headers";

export async function hamtaKunder() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.foretagsslug) {
    return [];
  }

  // Hämta kunder som har bokat hos detta företag
  const result = await db
    .select({
      id: kunder.id,
      email: kunder.email,
      namn: kunder.namn,
      telefon: kunder.telefon,
      skapadDatum: kunder.skapadDatum,
      antalBokningar: count(bokningar.id),
      senasteBokningDatum: sql<Date>`MAX(${bokningar.skapadDatum})`,
    })
    .from(kunder)
    .leftJoin(
      bokningar,
      sql`${bokningar.kundId} = ${kunder.id} AND ${bokningar.foretagsslug} = ${session.user.foretagsslug}`
    )
    .where(eq(kunder.foretagsslug, session.user.foretagsslug))
    .groupBy(kunder.id)
    .orderBy(desc(kunder.skapadDatum));

  return result;
}

export type KundMedStatistik = Awaited<ReturnType<typeof hamtaKunder>>[number];
