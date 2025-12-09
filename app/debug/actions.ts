"use server";

import { db } from "../_server/db";
import { tjanster } from "../_server/db/schema/tjanster";
import { bokningar } from "../_server/db/schema/bokningar";
import { anvandare } from "../_server/db/schema/anvandare";
import { utforare, utforareTjanster } from "../_server/db/schema/utforare";
import { user, session, account } from "../_server/db/schema/auth";
import { foretag } from "../_server/db/schema/foretag";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function raderaTjänster(ids: string[]) {
  try {
    await db.delete(tjanster).where(inArray(tjanster.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av tjänster:", error);
    return { success: false, error: "Kunde inte radera tjänster" };
  }
}

export async function raderaBokningar(ids: string[]) {
  try {
    await db.delete(bokningar).where(inArray(bokningar.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av bokningar:", error);
    return { success: false, error: "Kunde inte radera bokningar" };
  }
}

export async function raderaAnvändare(ids: string[]) {
  try {
    // Radera först alla bokningar kopplade till dessa användare
    await db.delete(bokningar).where(inArray(bokningar.kundId, ids));

    // Radera sedan användarna
    await db.delete(anvandare).where(inArray(anvandare.id, ids));

    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av användare:", error);
    return { success: false, error: "Kunde inte radera användare" };
  }
}

export async function raderaUtförare(ids: string[]) {
  try {
    await db.delete(utforare).where(inArray(utforare.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av utförare:", error);
    return { success: false, error: "Kunde inte radera utförare" };
  }
}

export async function raderaUtförareTjänster(ids: string[]) {
  try {
    await db.delete(utforareTjanster).where(inArray(utforareTjanster.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av kopplingar:", error);
    return { success: false, error: "Kunde inte radera kopplingar" };
  }
}

export async function raderaUsers(ids: string[]) {
  try {
    // Radera först alla sessioner och accounts kopplade till användarna
    await db.delete(session).where(inArray(session.userId, ids));
    await db.delete(account).where(inArray(account.userId, ids));

    // Radera sedan användarna
    await db.delete(user).where(inArray(user.id, ids));

    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av användare:", error);
    return { success: false, error: "Kunde inte radera användare" };
  }
}

export async function raderaFöretag(ids: string[]) {
  try {
    await db.delete(foretag).where(inArray(foretag.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av företag:", error);
    return { success: false, error: "Kunde inte radera företag" };
  }
}
