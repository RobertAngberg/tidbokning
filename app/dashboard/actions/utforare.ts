"use server";

import { db } from "../../_server/db";
import { utforare, utforareTjanster } from "../../_server/db/schema/utforare";
import type { Utforare } from "../../_server/db/schema/utforare";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { utforareInput } from "../validators/utforare";
import { z } from "zod";
import { auth } from "../../_server/auth";
import { headers } from "next/headers";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    const allaÜtförare = await db
      .select()
      .from(utforare)
      .where(eq(utforare.foretagsslug, session.user.foretagsslug));
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

    const validated = utforareInput.parse(data);

    const [nyUtförare] = await db
      .insert(utforare)
      .values({
        namn: validated.namn,
        email: validated.email || null,
        telefon: validated.telefon || null,
        beskrivning: validated.beskrivning || null,
        bildUrl: validated.bildUrl || null,
        aktiv: validated.aktiv,
        foretagsslug: session.user.foretagsslug,
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

const utforareFormDataSchema = z.object({
  namn: z.string().min(2, "Namnet måste vara minst 2 tecken").max(255),
  email: z.string().email("Ogiltig e-postadress").optional().or(z.literal("")),
  telefon: z.string().max(50).optional().or(z.literal("")),
  beskrivning: z.string().optional().or(z.literal("")),
  bildUrl: z.string().url("Ogiltig URL").optional().or(z.literal("")),
  aktiv: z
    .string()
    .optional()
    .transform((val) => val === "on"),
});

export async function skapaUtförareAction(_prevState: unknown, formData: FormData) {
  const rawData = {
    namn: formData.get("namn"),
    email: formData.get("email") || "",
    telefon: formData.get("telefon") || "",
    beskrivning: formData.get("beskrivning") || "",
    bildUrl: formData.get("bildUrl") || "",
    aktiv: formData.get("aktiv"),
  };

  const result = utforareFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  return await skapaUtförare(result.data);
}

export async function uppdateraUtförareAction(_prevState: unknown, formData: FormData) {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { success: false, error: "ID krävs" };
  }

  const rawData = {
    namn: formData.get("namn"),
    email: formData.get("email") || "",
    telefon: formData.get("telefon") || "",
    beskrivning: formData.get("beskrivning") || "",
    bildUrl: formData.get("bildUrl") || "",
    aktiv: formData.get("aktiv"),
  };

  const result = utforareFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  return await uppdateraUtförare(id, result.data);
}

export async function hämtaAktivaUtförareForFöretag(foretagsslug: string): Promise<Utforare[]> {
  try {
    const aktiva = await db
      .select()
      .from(utforare)
      .where(eq(utforare.foretagsslug, foretagsslug))
      .then((results) => results.filter((u) => u.aktiv));

    return aktiva;
  } catch (error) {
    console.error("Fel vid hämtning av utförare:", error);
    return [];
  }
}
