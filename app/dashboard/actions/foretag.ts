"use server";

import { db } from "../../_server/db";
import { foretag } from "../../_server/db/schema/foretag";
import { foretagSchema, type ForetagInput } from "../validators/foretag";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function hamtaForetag() {
  try {
    const result = await db.select().from(foretag).limit(1);
    return { success: true, data: result[0] || null };
  } catch (error) {
    console.error("Fel vid hämtning av företag:", error);
    return { success: false, error: "Kunde inte hämta företagsinformation" };
  }
}

export async function uppdateraForetag(id: string, data: ForetagInput) {
  try {
    const validated = foretagSchema.parse(data);

    type OppettiderType = {
      [key: string]: {
        open: string;
        close: string;
        stangt: boolean;
      };
    };

    const [updated] = await db
      .update(foretag)
      .set({
        namn: validated.namn,
        slug: validated.slug,
        beskrivning: validated.beskrivning,
        adress: validated.adress,
        postnummer: validated.postnummer,
        stad: validated.stad,
        telefon: validated.telefon,
        email: validated.email,
        webbplats: validated.webbplats,
        logoUrl: validated.logoUrl,
        oppettider: validated.oppettider as OppettiderType | null | undefined,
        primaryColor: validated.primaryColor,
        secondaryColor: validated.secondaryColor,
        aktiv: validated.aktiv,
        uppdateradVid: new Date(),
      })
      .where(eq(foretag.id, id))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Fel vid uppdatering av företag:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte uppdatera företaget",
    };
  }
}

export async function skapaForetag(data: ForetagInput) {
  try {
    const validated = foretagSchema.parse(data);

    type OppettiderType = {
      [key: string]: {
        open: string;
        close: string;
        stangt: boolean;
      };
    };

    const [created] = await db
      .insert(foretag)
      .values({
        namn: validated.namn,
        slug: validated.slug,
        beskrivning: validated.beskrivning,
        adress: validated.adress,
        postnummer: validated.postnummer,
        stad: validated.stad,
        telefon: validated.telefon,
        email: validated.email,
        webbplats: validated.webbplats,
        logoUrl: validated.logoUrl,
        oppettider: validated.oppettider as OppettiderType | null | undefined,
        primaryColor: validated.primaryColor,
        secondaryColor: validated.secondaryColor,
        aktiv: validated.aktiv,
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: created };
  } catch (error) {
    console.error("Fel vid skapande av företag:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte skapa företaget",
    };
  }
}

// Adapter-funktioner för useActionState
// useActionState kräver signatur: (prevState, formData: FormData) => Promise<Result>
// Dessa wrappers konverterar FormData → objekt och anropar de riktiga Server Actions

export async function uppdateraForetagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const id = formData.get("id") as string;
  const data = {
    namn: formData.get("namn") as string,
    slug: formData.get("slug") as string,
    beskrivning: formData.get("beskrivning") as string,
    adress: formData.get("adress") as string,
    postnummer: formData.get("postnummer") as string,
    stad: formData.get("stad") as string,
    telefon: formData.get("telefon") as string,
    email: formData.get("email") as string,
    webbplats: formData.get("webbplats") as string,
    logoUrl: formData.get("logoUrl") as string,
  };

  const result = await uppdateraForetag(id, data);
  return result.success ? { success: true } : { success: false, error: result.error };
}

export async function skapaForetagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const data = {
    namn: formData.get("namn") as string,
    slug: formData.get("slug") as string,
    beskrivning: formData.get("beskrivning") as string,
    adress: formData.get("adress") as string,
    postnummer: formData.get("postnummer") as string,
    stad: formData.get("stad") as string,
    telefon: formData.get("telefon") as string,
    email: formData.get("email") as string,
    webbplats: formData.get("webbplats") as string,
    logoUrl: formData.get("logoUrl") as string,
  };

  const result = await skapaForetag(data);
  return result.success ? { success: true } : { success: false, error: result.error };
}
