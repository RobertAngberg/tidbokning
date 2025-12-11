"use server";

import { db } from "../../../_server/db";
import { oppettider } from "../../../_server/db/schema/oppettider";
import { eq, and, asc } from "drizzle-orm";
import { auth } from "../../../_server/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Hämta öppettider för inloggat företag
export async function hamtaOppettider() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.foretagsslug) {
    return [];
  }

  return await db
    .select()
    .from(oppettider)
    .where(eq(oppettider.foretagsslug, session.user.foretagsslug))
    .orderBy(asc(oppettider.veckodag));
}

// Hämta öppettider för specifikt företag (publikt)
export async function hamtaOppettiderForForetag(slug: string) {
  return await db
    .select()
    .from(oppettider)
    .where(eq(oppettider.foretagsslug, slug))
    .orderBy(asc(oppettider.veckodag));
}

// Uppdatera eller skapa öppettid
export async function sparaOppettid(data: {
  veckodag: string;
  oppnar: string | null;
  stanger: string | null;
  stangt: boolean;
  lunchStart: string | null;
  lunchSlut: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.foretagsslug) {
    return { success: false, error: "Inte inloggad" };
  }

  try {
    // Kolla om öppettid finns
    const befintligResult = await db
      .select()
      .from(oppettider)
      .where(
        and(
          eq(oppettider.foretagsslug, session.user.foretagsslug),
          eq(oppettider.veckodag, data.veckodag)
        )
      )
      .limit(1);

    const befintlig = befintligResult[0];

    if (befintlig) {
      // Uppdatera
      await db
        .update(oppettider)
        .set({
          oppnar: data.oppnar,
          stanger: data.stanger,
          stangt: data.stangt,
          lunchStart: data.lunchStart,
          lunchSlut: data.lunchSlut,
        })
        .where(eq(oppettider.id, befintlig.id));
    } else {
      // Skapa ny
      await db.insert(oppettider).values({
        foretagsslug: session.user.foretagsslug,
        veckodag: data.veckodag,
        oppnar: data.oppnar,
        stanger: data.stanger,
        stangt: data.stangt,
        lunchStart: data.lunchStart,
        lunchSlut: data.lunchSlut,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/foretag/${session.user.foretagsslug}`);

    return { success: true };
  } catch (error) {
    console.error("Fel vid sparande av öppettid:", error);
    return { success: false, error: "Kunde inte spara öppettid" };
  }
}
