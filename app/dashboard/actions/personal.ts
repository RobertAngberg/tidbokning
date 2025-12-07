"use server";

import { db } from "../../_server/db";
import { personal } from "../../_server/db/schema/personal";
import { personalInput } from "../validators/personal";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function hämtaPersonal() {
  try {
    const allPersonal = await db.select().from(personal).orderBy(personal.namn);
    return allPersonal;
  } catch (error) {
    console.error("Fel vid hämtning av personal:", error);
    return [];
  }
}

export async function hämtaEnPersonal(id: string) {
  try {
    const [person] = await db.select().from(personal).where(eq(personal.id, id)).limit(1);
    return { success: true, data: person };
  } catch (error) {
    console.error("Fel vid hämtning av personal:", error);
    return { success: false, error: "Kunde inte hämta personal" };
  }
}

export async function skapaPersonal(data: unknown) {
  try {
    const validerad = personalInput.parse(data);

    const [nyPersonal] = await db
      .insert(personal)
      .values({
        namn: validerad.namn,
        email: validerad.email,
        telefon: validerad.telefon || null,
        bio: validerad.bio || null,
        profilbildUrl: validerad.profilbildUrl || null,
        aktiv: validerad.aktiv ? 1 : 0,
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: nyPersonal };
  } catch (error) {
    console.error("Fel vid skapande av personal:", error);
    return { success: false, error: "Kunde inte skapa personal" };
  }
}

export async function uppdateraPersonal(id: string, data: unknown) {
  try {
    const validerad = personalInput.parse(data);

    const [uppdateradPersonal] = await db
      .update(personal)
      .set({
        namn: validerad.namn,
        email: validerad.email,
        telefon: validerad.telefon || null,
        bio: validerad.bio || null,
        profilbildUrl: validerad.profilbildUrl || null,
        aktiv: validerad.aktiv ? 1 : 0,
        uppdateradDatum: new Date(),
      })
      .where(eq(personal.id, id))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: uppdateradPersonal };
  } catch (error) {
    console.error("Fel vid uppdatering av personal:", error);
    return { success: false, error: "Kunde inte uppdatera personal" };
  }
}

export async function raderaPersonal(id: string) {
  try {
    // Soft delete
    await db.update(personal).set({ aktiv: 0 }).where(eq(personal.id, id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av personal:", error);
    return { success: false, error: "Kunde inte radera personal" };
  }
}
