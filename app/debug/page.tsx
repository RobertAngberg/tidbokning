import { db } from "../_server/db";
import { tjanster } from "../_server/db/schema/tjanster";
import { kategorier } from "../_server/db/schema/kategorier";
import { bokningar } from "../_server/db/schema/bokningar";
import { anvandare } from "../_server/db/schema/anvandare";
import { kunder } from "../_server/db/schema/kunder";
import { recensioner } from "../_server/db/schema/recensioner";
import { utforare, utforareTjanster } from "../_server/db/schema/utforare";
import { user, session, account, verification } from "../_server/db/schema/auth";
import { foretag } from "../_server/db/schema/foretag";
import { DebugClient } from "./components/DebugClient";
import { eq } from "drizzle-orm";

export default async function DebugPage() {
  // Hämta tjänster med kategorinamn via JOIN
  const allTjanster = await db
    .select({
      id: tjanster.id,
      namn: tjanster.namn,
      beskrivning: tjanster.beskrivning,
      varaktighet: tjanster.varaktighet,
      pris: tjanster.pris,
      foretagsslug: tjanster.foretagsslug,
      kategoriId: tjanster.kategoriId,
      kategori: kategorier.namn,
      ordning: tjanster.ordning,
      aktiv: tjanster.aktiv,
      skapadDatum: tjanster.skapadDatum,
      uppdateradDatum: tjanster.uppdateradDatum,
    })
    .from(tjanster)
    .leftJoin(kategorier, eq(tjanster.kategoriId, kategorier.id));
  const allKategorier = await db.select().from(kategorier);
  const allBokningar = await db.select().from(bokningar);
  const allAnvandare = await db.select().from(anvandare);
  const allKunder = await db.select().from(kunder);
  const allRecensioner = await db.select().from(recensioner);
  const allUtforare = await db.select().from(utforare);
  const allUtforareTjanster = await db.select().from(utforareTjanster);
  const allUsers = await db.select().from(user);
  const allForetag = await db.select().from(foretag);
  const allSessions = await db.select().from(session);
  const allAccounts = await db.select().from(account);
  const allVerifications = await db.select().from(verification);

  return (
    <DebugClient
      tjanster={allTjanster}
      kategorier={allKategorier}
      bokningar={allBokningar}
      anvandare={allAnvandare}
      kunder={allKunder}
      recensioner={allRecensioner}
      utforare={allUtforare}
      utforareTjanster={allUtforareTjanster}
      users={allUsers}
      foretag={allForetag}
      sessions={allSessions}
      accounts={allAccounts}
      verifications={allVerifications}
    />
  );
}
