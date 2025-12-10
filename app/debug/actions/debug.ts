"use server";

import { db } from "../../_server/db";
import { tjanster } from "../../_server/db/schema/tjanster";
import { bokningar } from "../../_server/db/schema/bokningar";
import { anvandare } from "../../_server/db/schema/anvandare";
import { kunder } from "../../_server/db/schema/kunder";
import { recensioner } from "../../_server/db/schema/recensioner";
import { utforare, utforareTjanster } from "../../_server/db/schema/utforare";
import { user, session, account, verification } from "../../_server/db/schema/auth";
import { foretag } from "../../_server/db/schema/foretag";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function raderaTjanster(ids: string[]) {
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

export async function raderaAnvandare(ids: string[]) {
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

export async function raderaUtforare(ids: string[]) {
  try {
    await db.delete(utforare).where(inArray(utforare.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av utförare:", error);
    return { success: false, error: "Kunde inte radera utförare" };
  }
}

export async function raderaUtforareTjanster(ids: string[]) {
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

export async function raderaForetag(ids: string[]) {
  try {
    await db.delete(foretag).where(inArray(foretag.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av företag:", error);
    return { success: false, error: "Kunde inte radera företag" };
  }
}

export async function raderaKunder(ids: string[]) {
  try {
    // Radera först recensioner kopplade till kunderna
    await db.delete(recensioner).where(inArray(recensioner.kundId, ids));

    // Radera sedan bokningar kopplade till kunderna
    await db.delete(bokningar).where(inArray(bokningar.kundId, ids));

    // Radera slutligen kunderna
    await db.delete(kunder).where(inArray(kunder.id, ids));

    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av kunder:", error);
    return { success: false, error: "Kunde inte radera kunder" };
  }
}

export async function raderaRecensioner(ids: string[]) {
  try {
    await db.delete(recensioner).where(inArray(recensioner.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av recensioner:", error);
    return { success: false, error: "Kunde inte radera recensioner" };
  }
}

export async function raderaSessions(ids: string[]) {
  try {
    await db.delete(session).where(inArray(session.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av sessions:", error);
    return { success: false, error: "Kunde inte radera sessions" };
  }
}

export async function raderaAccounts(ids: string[]) {
  try {
    await db.delete(account).where(inArray(account.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av accounts:", error);
    return { success: false, error: "Kunde inte radera accounts" };
  }
}

export async function raderaVerifications(ids: string[]) {
  try {
    await db.delete(verification).where(inArray(verification.id, ids));
    revalidatePath("/debug");
    return { success: true };
  } catch (error) {
    console.error("Fel vid radering av verifications:", error);
    return { success: false, error: "Kunde inte radera verifications" };
  }
}
