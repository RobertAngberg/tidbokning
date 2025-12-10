"use server";

import { db } from "../../../_server/db";
import { bokningar } from "../../../_server/db/schema/bokningar";
import { tjanster } from "../../../_server/db/schema/tjanster";
import { kunder } from "../../../_server/db/schema/kunder";
import { utforare } from "../../../_server/db/schema/utforare";
import type { Bokning } from "../../../_server/db/schema/bokningar";
import type { Tjanst } from "../../../_server/db/schema/tjanster";
import type { Kund } from "../../../_server/db/schema/kunder";
import type { Utforare } from "../../../_server/db/schema/utforare";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { auth } from "../../../_server/auth";
import { headers } from "next/headers";

// Zod schema
const bokningSchema = z.object({
  kundNamn: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  kundEmail: z.string().email("Ogiltig e-postadress"),
  kundTelefon: z.string().min(10, "Telefonnummer måste vara minst 10 siffror"),
  tjänstId: z.string().uuid("Ogiltig tjänst"),
  utforareId: z.string().uuid("Ogiltig utförare").optional(),
  startTid: z.date(),
  anteckningar: z.string().optional(),
});

type BokningInput = z.infer<typeof bokningSchema>;

type BokningResult = { success: true; bokning: Bokning } | { success: false; error: string };

interface TillgängligTid {
  tid: string;
  tillgänglig: boolean;
}

export async function skapaBokning(data: BokningInput): Promise<BokningResult> {
  try {
    // Validera input
    const validerad = bokningSchema.safeParse(data);
    if (!validerad.success) {
      return {
        success: false,
        error: validerad.error.issues[0].message,
      };
    }

    // Hämta tjänsten för att få varaktighet
    const tjänst = await db.query.tjanster.findFirst({
      where: eq(tjanster.id, data.tjänstId),
    });

    if (!tjänst) {
      return { success: false, error: "Tjänsten finns inte" };
    }

    // Beräkna sluttid baserat på varaktighet
    const slutTid = new Date(data.startTid);
    slutTid.setMinutes(slutTid.getMinutes() + tjänst.varaktighet);

    // Skapa kund om den inte finns (förenklat - i verkligheten skulle vi kolla email)
    const [kund] = await db
      .insert(kunder)
      .values({
        email: data.kundEmail,
        namn: data.kundNamn,
        telefon: data.kundTelefon,
        foretagsslug: tjänst.foretagsslug,
      })
      .onConflictDoUpdate({
        target: kunder.email,
        set: {
          namn: data.kundNamn,
          telefon: data.kundTelefon,
        },
      })
      .returning();

    // Skapa bokning
    const [bokning] = await db
      .insert(bokningar)
      .values({
        kundId: kund.id,
        tjanstId: data.tjänstId,
        utforareId: data.utforareId,
        startTid: data.startTid,
        slutTid: slutTid,
        status: "Bekräftad",
        anteckningar: data.anteckningar,
        foretagsslug: tjänst.foretagsslug, // Använd företagsslugen från tjänsten
      })
      .returning();

    revalidatePath("/");
    return { success: true, bokning };
  } catch (error) {
    console.error("Fel vid bokning:", error);
    return { success: false, error: "Något gick fel vid bokningen" };
  }
}

export async function hamtaBokningar(): Promise<
  Array<Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }>
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.foretagsslug) {
      console.error("Ingen företagsslug i session");
      return [];
    }

    const allaBokningar = await db.query.bokningar.findMany({
      where: eq(bokningar.foretagsslug, session.user.foretagsslug),
      with: {
        kund: true,
        tjanst: true,
        utforare: true,
      },
      orderBy: (bokningar, { desc }) => [desc(bokningar.skapadDatum)],
    });

    return allaBokningar;
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    return [];
  }
}

export async function hamtaTjanster(): Promise<Tjanst[]> {
  try {
    const allaTjanster = await db.query.tjanster.findMany({
      where: eq(tjanster.aktiv, 1),
    });

    return allaTjanster;
  } catch (error) {
    console.error("Fel vid hämtning av tjänster:", error);
    return [];
  }
}

const tillgangligaTiderSchema = z.object({
  datum: z.date(),
  tjanstId: z.string().uuid("Ogiltigt tjänst-ID"),
});

export async function hamtaTillgangligaTider(
  datum: Date,
  tjanstId: string
): Promise<TillgängligTid[]> {
  try {
    const validated = tillgangligaTiderSchema.safeParse({ datum, tjanstId });
    if (!validated.success) {
      console.error("Valideringsfel:", validated.error.issues[0].message);
      return [];
    }

    // Hämta tjänsten för att få varaktighet
    const tjänst = await db.query.tjanster.findFirst({
      where: eq(tjanster.id, validated.data.tjanstId),
    });

    if (!tjänst) {
      return [];
    }

    // Generera alla möjliga tider mellan 09:00-17:00
    const tidslots: TillgängligTid[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (const minute of [0, 30]) {
        tidslots.push({
          tid: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          tillgänglig: true,
        });
      }
    }

    // Hämta alla bokningar för det datumet
    const startOfDay = new Date(validated.data.datum);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(validated.data.datum);
    endOfDay.setHours(23, 59, 59, 999);

    const bokningarPåDatum = await db.query.bokningar.findMany({
      where: (bokningar, { and, gte, lte }) =>
        and(gte(bokningar.startTid, startOfDay), lte(bokningar.startTid, endOfDay)),
    });

    // Markera upptagna tider
    for (const slot of tidslots) {
      const [hour, minute] = slot.tid.split(":").map(Number);
      const slotStart = new Date(validated.data.datum);
      slotStart.setHours(hour, minute, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + tjänst.varaktighet);

      // Kolla om detta slot överlappar med någon befintlig bokning
      for (const bokning of bokningarPåDatum) {
        const bokningStart = new Date(bokning.startTid);
        const bokningEnd = new Date(bokning.slutTid);

        // Om det finns överlappning
        if (slotStart < bokningEnd && slotEnd > bokningStart) {
          slot.tillgänglig = false;
          break;
        }
      }
    }

    return tidslots;
  } catch (error) {
    console.error("Fel vid hämtning av tillgängliga tider:", error);
    return [];
  }
}

export async function uppdateraBokning(
  bokningId: string,
  data: Partial<BokningInput>
): Promise<BokningResult> {
  try {
    // Hämta befintlig bokning
    const befintligBokning = await db.query.bokningar.findFirst({
      where: eq(bokningar.id, bokningId),
    });

    if (!befintligBokning) {
      return { success: false, error: "Bokningen finns inte" };
    }

    // Om startTid ändras, beräkna om slutTid
    let slutTid = befintligBokning.slutTid;
    if (data.startTid) {
      const tjänst = await db.query.tjanster.findFirst({
        where: eq(tjanster.id, data.tjänstId || befintligBokning.tjanstId),
      });

      if (tjänst) {
        slutTid = new Date(data.startTid);
        slutTid.setMinutes(slutTid.getMinutes() + tjänst.varaktighet);
      }
    }

    // Uppdatera bokning
    const [uppdateradBokning] = await db
      .update(bokningar)
      .set({
        ...(data.tjänstId && { tjanstId: data.tjänstId }),
        ...(data.startTid && { startTid: data.startTid, slutTid }),
      })
      .where(eq(bokningar.id, bokningId))
      .returning();

    revalidatePath("/");
    return { success: true, bokning: uppdateradBokning };
  } catch (error) {
    console.error("Fel vid uppdatering av bokning:", error);
    return { success: false, error: "Något gick fel vid uppdateringen" };
  }
}

const bokningsstatusSchema = z.object({
  bokningId: z.string().uuid("Ogiltigt boknings-ID"),
  status: z.enum(["Bekräftad", "Väntande", "Inställd", "Slutförd"], {
    message: "Ogiltig status",
  }),
});

export async function uppdateraBokningsstatus(
  bokningId: string,
  status: "Bekräftad" | "Väntande" | "Inställd" | "Slutförd"
): Promise<BokningResult> {
  try {
    const validated = bokningsstatusSchema.safeParse({ bokningId, status });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const [uppdateradBokning] = await db
      .update(bokningar)
      .set({ status: validated.data.status })
      .where(eq(bokningar.id, validated.data.bokningId))
      .returning();

    if (!uppdateradBokning) {
      return { success: false, error: "Bokningen finns inte" };
    }

    revalidatePath("/");
    return { success: true, bokning: uppdateradBokning };
  } catch (error) {
    console.error("Fel vid uppdatering av bokningsstatus:", error);
    return { success: false, error: "Något gick fel vid uppdateringen" };
  }
}

const bokningIdSchema = z.string().uuid("Ogiltigt boknings-ID");

export async function raderaBokning(
  bokningId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = bokningIdSchema.safeParse(bokningId);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await db.delete(bokningar).where(eq(bokningar.id, validated.data));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av bokning:", error);
    return { success: false, error: "Något gick fel vid raderingen" };
  }
}

export async function hamtaBokningarMedRelationer(
  foretagsslug: string
): Promise<
  Array<Bokning & { kund: Kund | null; tjanst: Tjanst | null; utforare: Utforare | null }>
> {
  try {
    const foretagBokningar = await db
      .select({
        id: bokningar.id,
        foretagsslug: bokningar.foretagsslug,
        skapadDatum: bokningar.skapadDatum,
        uppdateradDatum: bokningar.uppdateradDatum,
        kundId: bokningar.kundId,
        personalId: bokningar.personalId,
        tjanstId: bokningar.tjanstId,
        utforareId: bokningar.utforareId,
        startTid: bokningar.startTid,
        slutTid: bokningar.slutTid,
        status: bokningar.status,
        anteckningar: bokningar.anteckningar,
        kund: kunder,
        tjanst: tjanster,
        utforare: utforare,
      })
      .from(bokningar)
      .where(eq(bokningar.foretagsslug, foretagsslug))
      .leftJoin(kunder, eq(bokningar.kundId, kunder.id))
      .leftJoin(tjanster, eq(bokningar.tjanstId, tjanster.id))
      .leftJoin(utforare, eq(bokningar.utforareId, utforare.id));

    return foretagBokningar;
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    return [];
  }
}

export async function hamtaTjanstForForetag(
  tjanstId: string,
  foretagsslug: string
): Promise<Tjanst | null> {
  try {
    const [tjanst] = await db
      .select()
      .from(tjanster)
      .where(and(eq(tjanster.id, tjanstId), eq(tjanster.foretagsslug, foretagsslug)))
      .limit(1);

    return tjanst || null;
  } catch (error) {
    console.error("Fel vid hämtning av tjänst:", error);
    return null;
  }
}

export async function flyttaBokning(bokningId: string, nyStartTid: Date): Promise<BokningResult> {
  try {
    // Hämta befintlig bokning med tjänst info
    const befintligBokning = await db.query.bokningar.findFirst({
      where: eq(bokningar.id, bokningId),
      with: {
        tjanst: true,
      },
    });

    if (!befintligBokning) {
      return { success: false, error: "Bokningen finns inte" };
    }

    // Beräkna ny sluttid baserat på tjänstens varaktighet
    const nySlutTid = new Date(nyStartTid);
    if (befintligBokning.tjanst) {
      nySlutTid.setMinutes(nySlutTid.getMinutes() + befintligBokning.tjanst.varaktighet);
    }

    // Uppdatera bokning
    const [uppdateradBokning] = await db
      .update(bokningar)
      .set({
        startTid: nyStartTid,
        slutTid: nySlutTid,
      })
      .where(eq(bokningar.id, bokningId))
      .returning();

    revalidatePath("/dashboard/bokningar");
    return { success: true, bokning: uppdateradBokning };
  } catch (error) {
    console.error("Fel vid flytt av bokning:", error);
    return { success: false, error: "Något gick fel vid flytten" };
  }
}
