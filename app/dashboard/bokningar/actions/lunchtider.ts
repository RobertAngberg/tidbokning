"use server";

import { db } from "../../../_server/db";
import { lunchtider } from "../../../_server/db/schema/lunchtider";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function flyttaLunch(
  foretagsslug: string,
  franDatum: string,
  franStartTid: string,
  tillDatum: string,
  tillStartTid: string
) {
  try {
    // Check if there's an existing custom lunch to delete
    const existingLunch = await db.query.lunchtider.findFirst({
      where: and(
        eq(lunchtider.foretagsslug, foretagsslug),
        eq(lunchtider.datum, franDatum),
        eq(lunchtider.startTid, franStartTid)
      ),
    });

    if (existingLunch) {
      // Radera gammal lunchtid
      await db
        .delete(lunchtider)
        .where(
          and(
            eq(lunchtider.foretagsslug, foretagsslug),
            eq(lunchtider.datum, franDatum),
            eq(lunchtider.startTid, franStartTid)
          )
        );
    }

    // Beräkna sluttid (1 timme efter start)
    const [hours, minutes] = tillStartTid.split(":").map(Number);
    const slutHours = hours + 1;
    const tillSlutTid = `${slutHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Skapa ny lunchtid
    const [nyLunchtid] = await db
      .insert(lunchtider)
      .values({
        foretagsslug,
        datum: tillDatum,
        startTid: tillStartTid,
        slutTid: tillSlutTid,
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, lunchtid: nyLunchtid };
  } catch (error) {
    console.error("Fel vid flytt av lunch:", error);
    return { success: false, error: "Något gick fel vid flytten" };
  }
}

export async function hamtaLunchtider(foretagsslug: string) {
  try {
    const tider = await db.query.lunchtider.findMany({
      where: eq(lunchtider.foretagsslug, foretagsslug),
    });
    return tider;
  } catch (error) {
    console.error("Fel vid hämtning av lunchtider:", error);
    return [];
  }
}
