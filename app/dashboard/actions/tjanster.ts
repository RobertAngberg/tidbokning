"use server";

import { db } from "../../_server/db";
import { tjanster } from "../../_server/db/schema/tjanster";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "../../_server/auth";
import { headers } from "next/headers";

// Zod schema
const tjanstSchema = z.object({
  namn: z.string().min(1, "Namn krävs"),
  beskrivning: z.string().optional(),
  varaktighet: z.number().min(15, "Varaktighet måste vara minst 15 minuter"),
  pris: z.number().min(0, "Pris kan inte vara negativt"),
  kategori: z.string().optional(),
  aktiv: z.boolean().default(true),
});

type TjanstInput = z.infer<typeof tjanstSchema>;

export async function hämtaTjänster() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      throw new Error("Ingen företagsslug i session");
    }

    const allaTjanster = await db
      .select()
      .from(tjanster)
      .where(eq(tjanster.foretagsslug, session.user.foretagsslug));
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      return { success: false, error: "Ingen företagsslug i session" };
    }

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
        foretagsslug: session.user.foretagsslug,
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

const tjanstFormDataSchema = z.object({
  namn: z.string().min(1, "Namn krävs"),
  beskrivning: z.string().optional(),
  varaktighet: z.string().transform((val, ctx) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Varaktighet måste vara minst 15 minuter",
      });
      return z.NEVER;
    }
    return num;
  }),
  pris: z.string().transform((val, ctx) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pris måste vara ett giltigt nummer",
      });
      return z.NEVER;
    }
    return num * 100; // Konvertera till ören
  }),
  kategori: z.string().optional(),
  aktiv: z
    .string()
    .optional()
    .transform((val) => val === "on"),
});

export async function skapaTjänstAction(_prevState: unknown, formData: FormData) {
  const rawData = {
    namn: formData.get("namn"),
    beskrivning: formData.get("beskrivning") || "",
    varaktighet: formData.get("varaktighet"),
    pris: formData.get("pris"),
    kategori: formData.get("kategori") || "",
    aktiv: formData.get("aktiv"),
  };

  const result = tjanstFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  return await skapaTjänst(result.data);
}

export async function uppdateraTjänstAction(_prevState: unknown, formData: FormData) {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { success: false, error: "ID krävs" };
  }

  const rawData = {
    namn: formData.get("namn"),
    beskrivning: formData.get("beskrivning") || "",
    varaktighet: formData.get("varaktighet"),
    pris: formData.get("pris"),
    kategori: formData.get("kategori") || "",
    aktiv: formData.get("aktiv"),
  };

  const result = tjanstFormDataSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  return await uppdateraTjänst(id, result.data);
}

export async function hämtaTjänsterForFöretag(foretagsslug: string) {
  try {
    const foretagTjanster = await db
      .select()
      .from(tjanster)
      .where(eq(tjanster.foretagsslug, foretagsslug));
    return foretagTjanster;
  } catch (error) {
    console.error("Fel vid hämtning av tjänster:", error);
    return [];
  }
}
