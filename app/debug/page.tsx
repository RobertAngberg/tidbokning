import { db } from "../_server/db";
import { tjanster } from "../_server/db/schema/tjanster";
import { bokningar } from "../_server/db/schema/bokningar";
import { anvandare } from "../_server/db/schema/anvandare";
import { utforare, utforareTjanster } from "../_server/db/schema/utforare";
import { user, session, account, verification } from "../_server/db/schema/auth";
import { foretag } from "../_server/db/schema/foretag";
import { DebugClient } from "./components/DebugClient";

export default async function DebugPage() {
  const allTjanster = await db.select().from(tjanster);
  const allBokningar = await db.select().from(bokningar);
  const allAnvandare = await db.select().from(anvandare);
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
      bokningar={allBokningar}
      anvandare={allAnvandare}
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
