import { db } from "../_server/db";
import { tjanster } from "../_server/db/schema/tjanster";
import { bokningar } from "../_server/db/schema/bokningar";
import { anvandare } from "../_server/db/schema/anvandare";
import { utforare, utforareTjanster } from "../_server/db/schema/utforare";
import { user } from "../_server/db/schema/auth";
import { DebugClient } from "./components/DebugClient";

export default async function DebugPage() {
  const allTjanster = await db.select().from(tjanster);
  const allBokningar = await db.select().from(bokningar);
  const allAnvandare = await db.select().from(anvandare);
  const allUtforare = await db.select().from(utforare);
  const allUtforareTjanster = await db.select().from(utforareTjanster);
  const allUsers = await db.select().from(user);

  return (
    <DebugClient
      tjanster={allTjanster}
      bokningar={allBokningar}
      anvandare={allAnvandare}
      utforare={allUtforare}
      utforareTjanster={allUtforareTjanster}
      users={allUsers}
    />
  );
}
