import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./app/_server/db";
import { tjanster } from "./app/_server/db/schema";

async function seed() {
  console.log("🌱 Seedar databas...");

  // Lägg till tjänster
  await db.insert(tjanster).values([
    {
      namn: "Klippning",
      beskrivning: "Klippning och styling av hår",
      varaktighet: 45,
      pris: 50000, // 500 kr i ören
      foretagsslug: "demo",
      aktiv: 1,
    },
    {
      namn: "Färgning",
      beskrivning: "Professionell hårfärgning",
      varaktighet: 120,
      pris: 120000, // 1200 kr
      foretagsslug: "demo",
      aktiv: 1,
    },
    {
      namn: "Massage 60 min",
      beskrivning: "Avslappnande helkroppsmassage",
      varaktighet: 60,
      pris: 80000, // 800 kr
      foretagsslug: "demo",
      aktiv: 1,
    },
  ]);

  console.log("✅ Klar! Tjänster har lagts till.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Fel vid seeding:", error);
  process.exit(1);
});
