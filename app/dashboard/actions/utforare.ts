"use server";

import { db } from "../../_server/db";
import { utforare, utforareTjanster } from "../../_server/db/schema/utforare";
import type { Utforare } from "../../_server/db/schema/utforare";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { utforareInput } from "../validators/utforare";

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

export async function hämtaUtförare() {
  try {
    // TODO: Hämta foretagsslug från session
    const allaÜtförare = await db
      .select()
      .from(utforare)
      .where(eq(utforare.foretagsslug, "roberts-massage"));
    return { success: true, data: allaÜtförare };
  } catch (error) {
    console.error("Fel vid hämtning av utförare:", error);
    return { success: false, error: "Kunde inte hämta utförare" };
  }
}

export async function hämtaEnUtförare(id: string) {
  try {
    const [utförarePerson] = await db.select().from(utforare).where(eq(utforare.id, id)).limit(1);
    return { success: true, data: utförarePerson || null };
  } catch (error) {
    console.error("Fel vid hämtning av utförare:", error);
    return { success: false, error: "Kunde inte hämta utförare" };
  }
}

export async function skapaUtförare(data: unknown) {
  try {
    const validated = utforareInput.parse(data);

    // TODO: Hämta foretagsslug från session istället för hårdkodat
    const [nyUtförare] = await db
      .insert(utforare)
      .values({
        namn: validated.namn,
        email: validated.email || null,
        telefon: validated.telefon || null,
        beskrivning: validated.beskrivning || null,
        bildUrl: validated.bildUrl || null,
        aktiv: validated.aktiv,
        foretagsslug: "roberts-massage",
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: nyUtförare };
  } catch (error) {
    console.error("Fel vid skapande av utförare:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Kunde inte skapa utförare" };
  }
}

export async function uppdateraUtförare(id: string, data: unknown) {
  try {
    const validated = utforareInput.parse(data);

    const [uppdateradUtförare] = await db
      .update(utforare)
      .set({
        namn: validated.namn,
        email: validated.email || null,
        telefon: validated.telefon || null,
        beskrivning: validated.beskrivning || null,
        bildUrl: validated.bildUrl || null,
        aktiv: validated.aktiv,
        foretagsslug: "roberts-massage",
        uppdateradDatum: new Date(),
      })
      .where(eq(utforare.id, id))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: uppdateradUtförare };
  } catch (error) {
    console.error("Fel vid uppdatering av utförare:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Kunde inte uppdatera utförare" };
  }
}

export async function raderaUtförare(id: string) {
  try {
    await db.delete(utforare).where(eq(utforare.id, id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av utförare:", error);
    return { success: false, error: "Kunde inte radera utförare" };
  }
}

// Adapter-funktioner för useActionState
// useActionState kräver signatur: (prevState, formData: FormData) => Promise<Result>
// Dessa wrappers konverterar FormData → objekt och anropar de riktiga Server Actions
export async function skapaUtförareAction(_prevState: unknown, formData: FormData) {
  const data = {
    namn: formData.get("namn") as string,
    email: formData.get("email") as string,
    telefon: formData.get("telefon") as string,
    beskrivning: formData.get("beskrivning") as string,
    bildUrl: formData.get("bildUrl") as string,
    aktiv: formData.get("aktiv") === "on",
  };
  return await skapaUtförare(data);
}

export async function uppdateraUtförareAction(_prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const data = {
    namn: formData.get("namn") as string,
    email: formData.get("email") as string,
    telefon: formData.get("telefon") as string,
    beskrivning: formData.get("beskrivning") as string,
    bildUrl: formData.get("bildUrl") as string,
    aktiv: formData.get("aktiv") === "on",
  };
  return await uppdateraUtförare(id, data);
}
