"use server";

import { db } from "../../_server/db";
import { tjanster } from "../schema/tjanster";
import type { Tjanst } from "../schema/tjanster";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

const tjänstSchema = z.object({
  namn: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  beskrivning: z.string().optional(),
  varaktighet: z.number().min(15, "Minst 15 minuter").max(480, "Max 8 timmar"),
  pris: z.number().min(0, "Priset måste vara positivt"),
  foretagsslug: z.string(),
});

type TjänstInput = z.infer<typeof tjänstSchema>;
type TjänstResult = { success: true; tjänst: Tjanst } | { success: false; error: string };

export async function skapaTjänst(data: TjänstInput): Promise<TjänstResult> {
  try {
    const validerad = tjänstSchema.safeParse(data);
    if (!validerad.success) {
      return {
        success: false,
        error: validerad.error.issues[0].message,
      };
    }

    const [tjänst] = await db
      .insert(tjanster)
      .values({
        ...validerad.data,
        pris: Math.round(validerad.data.pris * 100), // Konvertera till ören
        aktiv: 1,
      })
      .returning();

    revalidatePath("/");
    revalidatePath("/tjanster");
    return { success: true, tjänst };
  } catch (error) {
    console.error("Fel vid skapande av tjänst:", error);
    return { success: false, error: "Något gick fel vid skapandet" };
  }
}

export async function uppdateraTjänst(
  id: string,
  data: Partial<TjänstInput>
): Promise<TjänstResult> {
  try {
    const [tjänst] = await db
      .update(tjanster)
      .set({
        ...data,
        pris: data.pris ? Math.round(data.pris * 100) : undefined,
        uppdateradDatum: new Date(),
      })
      .where(eq(tjanster.id, id))
      .returning();

    if (!tjänst) {
      return { success: false, error: "Tjänsten hittades inte" };
    }

    revalidatePath("/");
    revalidatePath("/tjanster");
    return { success: true, tjänst };
  } catch (error) {
    console.error("Fel vid uppdatering av tjänst:", error);
    return { success: false, error: "Något gick fel vid uppdateringen" };
  }
}

export async function toggleTjänstAktiv(id: string): Promise<TjänstResult> {
  try {
    const befintligTjänst = await db.query.tjanster.findFirst({
      where: eq(tjanster.id, id),
    });

    if (!befintligTjänst) {
      return { success: false, error: "Tjänsten hittades inte" };
    }

    const [tjänst] = await db
      .update(tjanster)
      .set({
        aktiv: befintligTjänst.aktiv === 1 ? 0 : 1,
        uppdateradDatum: new Date(),
      })
      .where(eq(tjanster.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/tjanster");
    return { success: true, tjänst };
  } catch (error) {
    console.error("Fel vid toggle av tjänst:", error);
    return { success: false, error: "Något gick fel" };
  }
}

export async function raderaTjänst(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(tjanster).where(eq(tjanster.id, id));

    revalidatePath("/");
    revalidatePath("/tjanster");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av tjänst:", error);
    return { success: false, error: "Något gick fel vid raderingen" };
  }
}

export async function hämtaAllaTjanster(): Promise<Tjanst[]> {
  try {
    const allaTjanster = await db.query.tjanster.findMany({
      orderBy: (tjanster, { desc }) => [desc(tjanster.skapadDatum)],
    });

    return allaTjanster;
  } catch (error) {
    console.error("Fel vid hämtning av tjänster:", error);
    return [];
  }
}
