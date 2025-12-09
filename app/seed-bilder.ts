import { db } from "./_server/db";
import { foretagBilder } from "./_server/db/schema/foretagBilder";

async function seedBilder() {
  console.log("🌱 Seedar testbilder...");

  const bilder = [
    {
      foretagsslug: "testforetaget",
      bildUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      beskrivning: "Modernt kontorsutrymme",
      sorteringsordning: 0,
    },
    {
      foretagsslug: "testforetaget",
      bildUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      beskrivning: "Kreativ arbetsmiljö",
      sorteringsordning: 1,
    },
    {
      foretagsslug: "testforetaget",
      bildUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      beskrivning: "Öppet kontorslandskap",
      sorteringsordning: 2,
    },
  ];

  for (const bild of bilder) {
    await db.insert(foretagBilder).values(bild);
    console.log(`✓ Lade till: ${bild.beskrivning}`);
  }

  console.log("✅ Klart!");
  process.exit(0);
}

seedBilder().catch((error) => {
  console.error("❌ Fel vid seedning:", error);
  process.exit(1);
});
