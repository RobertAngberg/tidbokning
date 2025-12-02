"use server";

import { db } from "../db";
import { bokningar, tjanster, anvandare } from "../db/schema";
import type { Bokning, Tjanst, Anvandare } from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { bokningSchema, type BokningInput } from "@/_lib/validators/bokning";

type BokningResult = { success: true; bokning: Bokning } | { success: false; error: string };

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
      .insert(anvandare)
      .values({
        email: data.kundEmail,
        namn: data.kundNamn,
        roll: "kund",
        foretagsslug: "demo", // Hårdkodat för nu
      })
      .onConflictDoUpdate({
        target: anvandare.email,
        set: { namn: data.kundNamn },
      })
      .returning();

    // Skapa bokning
    const [bokning] = await db
      .insert(bokningar)
      .values({
        kundId: kund.id,
        tjanstId: data.tjänstId,
        startTid: data.startTid,
        slutTid: slutTid,
        status: "bekraftad",
        foretagsslug: "demo",
      })
      .returning();

    revalidatePath("/");
    return { success: true, bokning };
  } catch (error) {
    console.error("Fel vid bokning:", error);
    return { success: false, error: "Något gick fel vid bokningen" };
  }
}

export async function hämtaBokningar(): Promise<
  Array<Bokning & { kund: Anvandare | null; tjanst: Tjanst | null }>
> {
  try {
    const allaBokningar = await db.query.bokningar.findMany({
      with: {
        kund: true,
        tjanst: true,
      },
      orderBy: (bokningar, { desc }) => [desc(bokningar.skapadDatum)],
    });

    return allaBokningar;
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    return [];
  }
}

export async function hämtaTjänster(): Promise<Tjanst[]> {
  try {
    const allaTjänster = await db.query.tjanster.findMany({
      where: eq(tjanster.aktiv, 1),
    });

    return allaTjänster;
  } catch (error) {
    console.error("Fel vid hämtning av tjänster:", error);
    return [];
  }
}

interface TillgängligTid {
  tid: string;
  tillgänglig: boolean;
}

export async function hämtaTillgängligaTider(
  datum: Date,
  tjanstId: string
): Promise<TillgängligTid[]> {
  try {
    // Hämta tjänsten för att få varaktighet
    const tjänst = await db.query.tjanster.findFirst({
      where: eq(tjanster.id, tjanstId),
    });

    if (!tjänst) {
      return [];
    }

    // Generera alla möjliga tider mellan 09:00-17:00
    const tidslots: TillgängligTid[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute of [0, 30]) {
        tidslots.push({
          tid: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          tillgänglig: true,
        });
      }
    }

    // Hämta alla bokningar för det datumet
    const startOfDay = new Date(datum);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(datum);
    endOfDay.setHours(23, 59, 59, 999);

    const bokningarPåDatum = await db.query.bokningar.findMany({
      where: (bokningar, { and, gte, lte }) =>
        and(gte(bokningar.startTid, startOfDay), lte(bokningar.startTid, endOfDay)),
    });

    // Markera upptagna tider
    for (const slot of tidslots) {
      const [hour, minute] = slot.tid.split(":").map(Number);
      const slotStart = new Date(datum);
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
