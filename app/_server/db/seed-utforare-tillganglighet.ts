import { db } from "./index";
import { utforareTillganglighet } from "./schema/utforare-tillganglighet";
import { utforare } from "./schema/utforare";

// Seeda tillgänglighet för utförare
async function seedUtforareTillganglighet() {
  console.log("🌱 Seeding utförare tillgänglighet...");

  // Hämta alla utförare
  const allaUtforare = await db.select().from(utforare);

  if (allaUtforare.length === 0) {
    console.log("⚠️  Inga utförare hittades. Skapa utförare först.");
    return;
  }

  console.log(`Hittade ${allaUtforare.length} utförare`);

  // För varje utförare, skapa lite varierad tillgänglighet
  for (let i = 0; i < allaUtforare.length; i++) {
    const utf = allaUtforare[i];
    console.log(`Skapar tillgänglighet för ${utf.namn}...`);

    // Variera tillgänglighet mellan utförare
    if (i % 3 === 0) {
      // Utförare 1, 4, 7... arbetar måndag-onsdag 09:00-16:00
      await db.insert(utforareTillganglighet).values([
        {
          utforareId: utf.id,
          veckodag: "måndag",
          startTid: "09:00",
          slutTid: "16:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "tisdag",
          startTid: "09:00",
          slutTid: "16:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "onsdag",
          startTid: "09:00",
          slutTid: "16:00",
          ledig: true,
        },
      ]);
    } else if (i % 3 === 1) {
      // Utförare 2, 5, 8... arbetar onsdag-fredag 10:00-18:00
      await db.insert(utforareTillganglighet).values([
        {
          utforareId: utf.id,
          veckodag: "onsdag",
          startTid: "10:00",
          slutTid: "18:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "torsdag",
          startTid: "10:00",
          slutTid: "18:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "fredag",
          startTid: "10:00",
          slutTid: "18:00",
          ledig: true,
        },
      ]);
    } else {
      // Utförare 3, 6, 9... arbetar alla vardagar 08:00-15:00
      await db.insert(utforareTillganglighet).values([
        {
          utforareId: utf.id,
          veckodag: "måndag",
          startTid: "08:00",
          slutTid: "15:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "tisdag",
          startTid: "08:00",
          slutTid: "15:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "onsdag",
          startTid: "08:00",
          slutTid: "15:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "torsdag",
          startTid: "08:00",
          slutTid: "15:00",
          ledig: true,
        },
        {
          utforareId: utf.id,
          veckodag: "fredag",
          startTid: "08:00",
          slutTid: "15:00",
          ledig: true,
        },
      ]);
    }
  }

  console.log("✅ Seedning klar!");
}

seedUtforareTillganglighet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Fel vid seedning:", error);
    process.exit(1);
  });
