"use server";

import { db } from "../../_server/db";
import { foretag } from "../../_server/db/schema/foretag";
import { foretagSchema, type ForetagInput } from "../validators/foretag";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function hämtaFöretag() {
  try {
    const result = await db.select().from(foretag).limit(1);
    return { success: true, data: result[0] || null };
  } catch (error) {
    console.error("Fel vid hämtning av företag:", error);
    return { success: false, error: "Kunde inte hämta företagsinformation" };
  }
}

export async function uppdateraFöretag(id: string, data: ForetagInput) {
  try {
    const validated = foretagSchema.parse(data);

    // Autogenerera slug från namn
    const slug = validated.namn
      .toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

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
        slug: slug,
        beskrivning: validated.beskrivning,
        adress: validated.adress,
        postnummer: validated.postnummer,
        stad: validated.stad,
        telefon: validated.telefon,
        email: validated.email,
        webbplats: validated.webbplats,
        logoUrl: validated.logoUrl,
        oppettider: validated.oppettider as OppettiderType | null | undefined,
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

export async function skapaFöretag(data: ForetagInput) {
  try {
    const validated = foretagSchema.parse(data);

    // Autogenerera slug från namn
    const slug = validated.namn
      .toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

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
        slug: slug,
        beskrivning: validated.beskrivning,
        adress: validated.adress,
        postnummer: validated.postnummer,
        stad: validated.stad,
        telefon: validated.telefon,
        email: validated.email,
        webbplats: validated.webbplats,
        logoUrl: validated.logoUrl,
        oppettider: validated.oppettider as OppettiderType | null | undefined,
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

const foretagFormDataSchema = z.object({
  namn: z.string().min(1, "Namn krävs").max(255),
  beskrivning: z.string().optional().or(z.literal("")),
  adress: z.string().max(255).optional().or(z.literal("")),
  postnummer: z.string().max(10).optional().or(z.literal("")),
  stad: z.string().max(100).optional().or(z.literal("")),
  telefon: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Ogiltig e-postadress").max(255).optional().or(z.literal("")),
  webbplats: z.string().url("Ogiltig URL").max(255).optional().or(z.literal("")),
  logoUrl: z.string().url("Ogiltig URL").max(500).optional().or(z.literal("")),
});

export async function uppdateraFöretagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { success: false, error: "ID krävs" };
  }

  const rawData = {
    namn: formData.get("namn"),
    beskrivning: formData.get("beskrivning") || "",
    adress: formData.get("adress") || "",
    postnummer: formData.get("postnummer") || "",
    stad: formData.get("stad") || "",
    telefon: formData.get("telefon") || "",
    email: formData.get("email") || "",
    webbplats: formData.get("webbplats") || "",
    logoUrl: formData.get("logoUrl") || "",
  };

  const result = foretagFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const updateResult = await uppdateraFöretag(id, {
    ...result.data,
    aktiv: true,
  });
  return updateResult.success ? { success: true } : { success: false, error: updateResult.error };
}

export async function skapaFöretagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const rawData = {
    namn: formData.get("namn"),
    beskrivning: formData.get("beskrivning") || "",
    adress: formData.get("adress") || "",
    postnummer: formData.get("postnummer") || "",
    stad: formData.get("stad") || "",
    telefon: formData.get("telefon") || "",
    email: formData.get("email") || "",
    webbplats: formData.get("webbplats") || "",
    logoUrl: formData.get("logoUrl") || "",
  };

  const result = foretagFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const createResult = await skapaFöretag({
    ...result.data,
    aktiv: true,
  });
  return createResult.success ? { success: true } : { success: false, error: createResult.error };
}

export async function hämtaFöretagBySlug(slug: string) {
  try {
    const [foretagData] = await db.select().from(foretag).where(eq(foretag.slug, slug)).limit(1);
    return foretagData || null;
  } catch (error) {
    console.error("Fel vid hämtning av företag:", error);
    return null;
  }
}
