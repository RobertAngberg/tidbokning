import { config } from "dotenv";
config({ path: "../.env.local" });

import { db } from "./_server/db";
import { sql } from "drizzle-orm";

async function updateStatusValues() {
  console.log("Uppdaterar statusvärden i databasen...");

  try {
    // Uppdatera alla gamla statusvärden till nya svenska
    await db.execute(sql`UPDATE bokningar SET status = 'Bekräftad' WHERE status = 'bekraftad'`);
    await db.execute(sql`UPDATE bokningar SET status = 'Väntande' WHERE status = 'vaentande'`);
    await db.execute(sql`UPDATE bokningar SET status = 'Inställd' WHERE status = 'installld'`);
    await db.execute(sql`UPDATE bokningar SET status = 'Slutförd' WHERE status = 'slutford'`);

    console.log("✅ Statusvärden uppdaterade!");
  } catch (error) {
    console.error("❌ Fel vid uppdatering:", error);
    process.exit(1);
  }

  process.exit(0);
}

updateStatusValues();
