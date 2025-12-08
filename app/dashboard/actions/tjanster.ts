"use server";

import { db } from "../../_server/db";
import { tjanster } from "../../_server/db/schema/tjanster";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { tjanstSchema } from "../validators/tjanst";

export async function hämtaTjänster() {
  try {
    const allaTjanster = await db.select().from(tjanster);
    return allaTjanster;
  } catch (error) {
    console.error("Fel vid hämtning av tjänster:", error);
    throw new Error("Kunde inte hämta tjänster");
  }
}

export async function hämtaTjänst(id: string) {
  try {
    const tjanst = await db.select().from(tjanster).where(eq(tjanster.id, id)).limit(1);
    return tjanst[0] || null;
  } catch (error) {
    console.error("Fel vid hämtning av tjänst:", error);
    throw new Error("Kunde inte hämta tjänst");
  }
}

export async function skapaTjänst(data: {
  namn: string;
  beskrivning?: string;
  varaktighet: number;
  pris: number;
  kategori?: string;
  aktiv?: boolean;
}) {
  try {
    // Validera input
    const validatedData = tjanstSchema.parse(data);

    const [nyTjanst] = await db
      .insert(tjanster)
      .values({
        namn: validatedData.namn,
        beskrivning: validatedData.beskrivning || null,
        varaktighet: validatedData.varaktighet,
        pris: validatedData.pris,
        kategori: validatedData.kategori || null,
        aktiv: validatedData.aktiv ? 1 : 0,
        foretagsslug: "roberts-massage", // Hårdkodat tills vi har företagsinställningar
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: nyTjanst };
  } catch (error) {
    console.error("Fel vid skapande av tjänst:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Kunde inte skapa tjänst" };
  }
}

export async function uppdateraTjänst(
  id: string,
  data: {
    namn: string;
    beskrivning?: string;
    varaktighet: number;
    pris: number;
    kategori?: string;
    aktiv?: boolean;
  }
) {
  try {
    // Validera input
    const validatedData = tjanstSchema.parse(data);

    const [uppdateradTjanst] = await db
      .update(tjanster)
      .set({
        namn: validatedData.namn,
        beskrivning: validatedData.beskrivning || null,
        varaktighet: validatedData.varaktighet,
        pris: validatedData.pris,
        kategori: validatedData.kategori || null,
        aktiv: validatedData.aktiv ? 1 : 0,
        uppdateradDatum: new Date(),
      })
      .where(eq(tjanster.id, id))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: uppdateradTjanst };
  } catch (error) {
    console.error("Fel vid uppdatering av tjänst:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Kunde inte uppdatera tjänst" };
  }
}

export async function raderaTjänst(id: string) {
  try {
    // Soft delete - sätt aktiv till 0 istället för att radera
    await db
      .update(tjanster)
      .set({ aktiv: 0, uppdateradDatum: new Date() })
      .where(eq(tjanster.id, id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av tjänst:", error);
    return { success: false, error: "Kunde inte radera tjänst" };
  }
}

export async function aktiveraTjänst(id: string, aktiv: boolean) {
  try {
    await db
      .update(tjanster)
      .set({ aktiv: aktiv ? 1 : 0, uppdateradDatum: new Date() })
      .where(eq(tjanster.id, id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid aktivering/inaktivering av tjänst:", error);
    return { success: false, error: "Kunde inte uppdatera tjänst" };
  }
}

// Adapter-funktioner för useActionState
// useActionState kräver signatur: (prevState, formData: FormData) => Promise<Result>
// Dessa wrappers konverterar FormData → objekt och anropar de riktiga Server Actions
export async function skapaTjänstAction(_prevState: unknown, formData: FormData) {
  const data = {
    namn: formData.get("namn") as string,
    beskrivning: formData.get("beskrivning") as string,
    varaktighet: parseInt(formData.get("varaktighet") as string),
    pris: parseFloat(formData.get("pris") as string) * 100, // Konvertera till ören
    kategori: formData.get("kategori") as string,
    aktiv: formData.get("aktiv") === "on",
  };
  return await skapaTjänst(data);
}

export async function uppdateraTjänstAction(_prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const data = {
    namn: formData.get("namn") as string,
    beskrivning: formData.get("beskrivning") as string,
    varaktighet: parseInt(formData.get("varaktighet") as string),
    pris: parseFloat(formData.get("pris") as string) * 100, // Konvertera till ören
    kategori: formData.get("kategori") as string,
    aktiv: formData.get("aktiv") === "on",
  };
  return await uppdateraTjänst(id, data);
}
