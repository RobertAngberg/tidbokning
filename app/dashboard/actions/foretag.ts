"use server";

import { db } from "../../_server/db";
import { foretag } from "../../_server/db/schema/foretag";
import { foretagSchema, type ForetagInput } from "../validators/foretag";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

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

const foretagFormDataSchema = z.object({
  namn: z.string().min(1, "Namn krävs").max(255),
  slug: z
    .string()
    .min(1, "Slug krävs")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Endast små bokstäver, siffror och bindestreck"),
  beskrivning: z.string().optional().or(z.literal("")),
  adress: z.string().max(255).optional().or(z.literal("")),
  postnummer: z.string().max(10).optional().or(z.literal("")),
  stad: z.string().max(100).optional().or(z.literal("")),
  telefon: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Ogiltig e-postadress").max(255).optional().or(z.literal("")),
  webbplats: z.string().url("Ogiltig URL").max(255).optional().or(z.literal("")),
  logoUrl: z.string().url("Ogiltig URL").max(500).optional().or(z.literal("")),
});

export async function uppdateraForetagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { success: false, error: "ID krävs" };
  }

  const rawData = {
    namn: formData.get("namn"),
    slug: formData.get("slug"),
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

  const updateResult = await uppdateraForetag(id, result.data);
  return updateResult.success ? { success: true } : { success: false, error: updateResult.error };
}

export async function skapaForetagAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const rawData = {
    namn: formData.get("namn"),
    slug: formData.get("slug"),
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

  const createResult = await skapaForetag(result.data);
  return createResult.success ? { success: true } : { success: false, error: createResult.error };
}
