"use server";

import { db } from "../_server/db";
import { foretag } from "../_server/db/schema/foretag";
import { anvandare } from "../_server/db/schema/anvandare";
import { auth } from "../_server/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const foretagOnboardingSchema = z.object({
  foretagsnamn: z.string().min(1, "Företagsnamn krävs"),
  adress: z.string().optional(),
  postnummer: z.string().optional(),
  stad: z.string().optional(),
  telefon: z.string().optional(),
  webbplats: z.string().url("Ogiltig URL").optional().or(z.literal("")),
});

export async function skapaFöretagOchAdminAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Hämta session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Du måste vara inloggad" };
    }

    // Validera formulärdata
    const rawData = {
      foretagsnamn: formData.get("foretagsnamn"),
      adress: formData.get("adress") || "",
      postnummer: formData.get("postnummer") || "",
      stad: formData.get("stad") || "",
      telefon: formData.get("telefon") || "",
      webbplats: formData.get("webbplats") || "",
    };

    const result = foretagOnboardingSchema.safeParse(rawData);
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const { foretagsnamn, beskrivning, telefon, email } = result.data;

    // Generera slug från företagsnamnet
    const slug = foretagsnamn
      .toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Kolla om slug redan finns
    const [existingForetag] = await db
      .select()
      .from(foretag)
      .where(eq(foretag.slug, slug))
      .limit(1);

    if (existingForetag) {
      return {
        success: false,
        error: "Ett företag med detta namn finns redan. Välj ett annat namn.",
      };
    }

    // Skapa företaget
    const [nyttForetag] = await db
      .insert(foretag)
      .values({
        namn: foretagsnamn,
        slug: slug,
        beskrivning: beskrivning || null,
        telefon: telefon || null,
        email: email || null,
        aktiv: true,
      })
      .returning();

    // Uppdatera användaren till admin och koppla till företaget
    await db
      .update(anvandare)
      .set({
        roll: "admin",
        foretagsslug: slug,
      })
      .where(eq(anvandare.id, session.user.id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid skapande av företag:", error);
    return {
      success: false,
      error: "Kunde inte skapa företag. Försök igen.",
    };
  }
}
