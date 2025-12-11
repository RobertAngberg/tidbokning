"use server";

import { db } from "../../../_server/db";
import { kategorier } from "../../../_server/db/schema/kategorier";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Hämta alla kategorier för ett företag
export async function hamtaKategorier(foretagsslug: string) {
  return await db
    .select()
    .from(kategorier)
    .where(eq(kategorier.foretagsslug, foretagsslug))
    .orderBy(asc(kategorier.ordning), asc(kategorier.namn));
}

// Skapa ny kategori
export async function skapaKategori(prevState: unknown, formData: FormData) {
  try {
    const namn = formData.get("namn") as string;
    const beskrivning = formData.get("beskrivning") as string | null;
    const foretagsslug = formData.get("foretagsslug") as string;
    const ordning = parseInt(formData.get("ordning") as string) || 0;

    if (!namn || !foretagsslug) {
      return { success: false, error: "Namn och företagsslug krävs" };
    }

    await db.insert(kategorier).values({
      namn,
      beskrivning: beskrivning || null,
      foretagsslug,
      ordning,
    });

    revalidatePath("/dashboard/tjanster");
    return { success: true };
  } catch (error) {
    console.error("Fel vid skapande av kategori:", error);
    return { success: false, error: "Kunde inte skapa kategori" };
  }
}

// Uppdatera kategori
export async function uppdateraKategori(prevState: unknown, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const namn = formData.get("namn") as string;
    const beskrivning = formData.get("beskrivning") as string | null;
    const ordning = parseInt(formData.get("ordning") as string) || 0;
    const aktiv = formData.get("aktiv") === "on" ? 1 : 0;

    if (!id || !namn) {
      return { success: false, error: "ID och namn krävs" };
    }

    await db
      .update(kategorier)
      .set({
        namn,
        beskrivning: beskrivning || null,
        ordning,
        aktiv,
        uppdateradDatum: new Date(),
      })
      .where(eq(kategorier.id, id));

    revalidatePath("/dashboard/tjanster");
    return { success: true };
  } catch (error) {
    console.error("Fel vid uppdatering av kategori:", error);
    return { success: false, error: "Kunde inte uppdatera kategori" };
  }
}

// Radera kategori
export async function raderaKategori(id: string) {
  try {
    await db.delete(kategorier).where(eq(kategorier.id, id));
    revalidatePath("/dashboard/tjanster");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av kategori:", error);
    return { success: false, error: "Kunde inte radera kategori" };
  }
}

// Uppdatera sorteringsordning för kategorier
export async function uppdateraKategoriOrdning(
  kategoriOrdningar: { id: string; ordning: number }[]
) {
  try {
    // Uppdatera alla kategorier i en transaktion
    await Promise.all(
      kategoriOrdningar.map(({ id, ordning }) =>
        db.update(kategorier).set({ ordning }).where(eq(kategorier.id, id))
      )
    );

    revalidatePath("/dashboard/tjanster");
    return { success: true };
  } catch (error) {
    console.error("Fel vid uppdatering av kategoriordning:", error);
    return { success: false, error: "Kunde inte uppdatera ordning" };
  }
}
