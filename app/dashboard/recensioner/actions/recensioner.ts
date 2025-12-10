"use server";

import { db } from "../../../_server/db";
import { recensioner, bokningar, kunder } from "../../../_server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validering
const recensionSchema = z.object({
  kundEmail: z.string().email("Ogiltig e-postadress"),
  foretagsslug: z.string().min(1, "Företagsslug saknas"),
  betyg: z.number().int().min(1, "Betyg måste vara minst 1").max(5, "Betyg måste vara högst 5"),
  kommentar: z.string().optional(),
});

type RecensionInput = z.infer<typeof recensionSchema>;

interface RecensionResult {
  success: boolean;
  error?: string;
  recension?: typeof recensioner.$inferSelect;
}

export async function skapaRecension(data: RecensionInput): Promise<RecensionResult> {
  try {
    // Validera input
    const validerad = recensionSchema.safeParse(data);
    if (!validerad.success) {
      return {
        success: false,
        error: validerad.error.issues[0].message,
      };
    }

    // Hämta kunden baserat på email
    const [kund] = await db.select().from(kunder).where(eq(kunder.email, data.kundEmail)).limit(1);

    if (!kund) {
      return { success: false, error: "Ingen kund hittades med denna e-postadress" };
    }

    // Hämta kundens senaste slutförda bokning för detta företag som inte har recension
    const kundBokningar = await db
      .select({
        bokningId: bokningar.id,
        foretagsslug: bokningar.foretagsslug,
        status: bokningar.status,
        startTid: bokningar.startTid,
        harRecension: recensioner.id,
      })
      .from(bokningar)
      .leftJoin(recensioner, eq(bokningar.id, recensioner.bokningId))
      .where(
        and(
          eq(bokningar.kundId, kund.id),
          eq(bokningar.foretagsslug, data.foretagsslug),
          eq(bokningar.status, "Slutförd")
        )
      )
      .orderBy(desc(bokningar.startTid));

    // Hitta första bokningen utan recension
    const bokningUtenRecension = kundBokningar.find((b) => !b.harRecension);

    if (!bokningUtenRecension) {
      return {
        success: false,
        error:
          "Inga slutförda bokningar hittades som kan recenseras. Antingen har du inga slutförda bokningar eller så har du redan recenserat dem alla.",
      };
    }

    // Skapa recensionen
    const [recension] = await db
      .insert(recensioner)
      .values({
        kundId: kund.id,
        bokningId: bokningUtenRecension.bokningId,
        foretagsslug: data.foretagsslug,
        betyg: data.betyg,
        kommentar: data.kommentar,
      })
      .returning();

    revalidatePath(`/foretag/${data.foretagsslug}`);
    return { success: true, recension };
  } catch (error) {
    console.error("Fel vid skapande av recension:", error);
    return { success: false, error: "Något gick fel vid skapandet av recensionen" };
  }
}

export async function hämtaRecensioner(foretagsslug: string) {
  try {
    const foretagRecensioner = await db
      .select({
        id: recensioner.id,
        betyg: recensioner.betyg,
        kommentar: recensioner.kommentar,
        skapadDatum: recensioner.skapadDatum,
        kund: {
          namn: kunder.namn,
        },
      })
      .from(recensioner)
      .leftJoin(kunder, eq(recensioner.kundId, kunder.id))
      .where(eq(recensioner.foretagsslug, foretagsslug))
      .orderBy(desc(recensioner.skapadDatum));

    return foretagRecensioner;
  } catch (error) {
    console.error("Fel vid hämtning av recensioner:", error);
    return [];
  }
}

export async function hämtaSnittbetyg(foretagsslug: string): Promise<number | null> {
  try {
    const foretagRecensioner = await db
      .select({
        betyg: recensioner.betyg,
      })
      .from(recensioner)
      .where(eq(recensioner.foretagsslug, foretagsslug));

    if (foretagRecensioner.length === 0) {
      return null;
    }

    const summa = foretagRecensioner.reduce((acc: number, r) => acc + r.betyg, 0);
    return summa / foretagRecensioner.length;
  } catch (error) {
    console.error("Fel vid beräkning av snittbetyg:", error);
    return null;
  }
}
