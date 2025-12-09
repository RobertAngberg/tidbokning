"use server";

import { db } from "../../_server/db";
import { foretagBilder } from "../../_server/db/schema/foretagBilder";
import type { ForetagBild } from "../../_server/db/schema/foretagBilder";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../../_server/auth";
import { headers } from "next/headers";

export async function hämtaBilder() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    const bilder = await db
      .select()
      .from(foretagBilder)
      .where(eq(foretagBilder.foretagsslug, session.user.foretagsslug))
      .orderBy(asc(foretagBilder.sorteringsordning));

    return { success: true, data: bilder };
  } catch (error) {
    console.error("Fel vid hämtning av bilder:", error);
    return { success: false, error: "Kunde inte hämta bilder" };
  }
}

export async function hämtaBilderForFöretag(foretagsslug: string): Promise<ForetagBild[]> {
  try {
    const bilder = await db
      .select()
      .from(foretagBilder)
      .where(eq(foretagBilder.foretagsslug, foretagsslug))
      .orderBy(asc(foretagBilder.sorteringsordning));

    return bilder;
  } catch (error) {
    console.error("Fel vid hämtning av bilder:", error);
    return [];
  }
}

export async function laddaUppBild(data: {
  bildUrl: string;
  beskrivning?: string;
  sorteringsordning?: number;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    const [nyBild] = await db
      .insert(foretagBilder)
      .values({
        foretagsslug: session.user.foretagsslug,
        bildUrl: data.bildUrl,
        beskrivning: data.beskrivning || null,
        sorteringsordning: data.sorteringsordning || 0,
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/foretag/[slug]", "page");
    return { success: true, data: nyBild };
  } catch (error) {
    console.error("Fel vid uppladdning av bild:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Kunde inte ladda upp bild" };
  }
}

export async function raderaBild(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    // Verifiera att bilden tillhör företaget
    const [bild] = await db.select().from(foretagBilder).where(eq(foretagBilder.id, id)).limit(1);

    if (!bild) {
      return { success: false, error: "Bilden hittades inte" };
    }

    if (bild.foretagsslug !== session.user.foretagsslug) {
      return { success: false, error: "Du har inte behörighet att radera denna bild" };
    }

    await db.delete(foretagBilder).where(eq(foretagBilder.id, id));

    revalidatePath("/dashboard");
    revalidatePath("/foretag/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av bild:", error);
    return { success: false, error: "Kunde inte radera bild" };
  }
}

export async function uppdateraSorteringsordning(
  bilder: { id: string; sorteringsordning: number }[]
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    // Uppdatera sorteringsordning för alla bilder
    await Promise.all(
      bilder.map((bild) =>
        db
          .update(foretagBilder)
          .set({ sorteringsordning: bild.sorteringsordning })
          .where(eq(foretagBilder.id, bild.id))
      )
    );

    revalidatePath("/dashboard");
    revalidatePath("/foretag/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Fel vid uppdatering av sorteringsordning:", error);
    return { success: false, error: "Kunde inte uppdatera sorteringsordning" };
  }
}
