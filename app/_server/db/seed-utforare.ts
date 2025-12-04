import { db } from "./index";
import { tjanster } from "./schema/tjanster";
import { utforare, utforareTjanster } from "./schema/utforare";

async function seedUtforare() {
  console.log("🌱 Seeding utförare...");

  // Ta bort gamla kopplingar och utförare
  await db.delete(utforareTjanster);
  await db.delete(utforare);

  // Skapa 3 utförare
  const utforareData = await db
    .insert(utforare)
    .values([
      {
        namn: "Erik Nilsson",
        email: "erik@example.com",
        telefon: "070-234 56 78",
        beskrivning: "Specialist på thaimassage och rygg & nackmassage",
        bildUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=erik-male&size=96",
        aktiv: true,
      },
      {
        namn: "Anna Andersson",
        email: "anna@example.com",
        telefon: "070-123 45 67",
        beskrivning: "Legitimerad massör med 10 års erfarenhet inom oljemassage och thaimassage",
        bildUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=anna-female&size=96",
        aktiv: true,
      },
      {
        namn: "Maria Svensson",
        email: "maria@example.com",
        telefon: "070-345 67 89",
        beskrivning: "Expert på fotbehandling och avslappningsmassage",
        bildUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=maria-female&size=96",
        aktiv: true,
      },
    ])
    .returning();

  console.log(`✅ Created ${utforareData.length} utförare`);

  // Hämta alla tjänster
  const allaTjanster = await db.select().from(tjanster);
  console.log(`📋 Found ${allaTjanster.length} tjänster`);

  // Koppla utförare till tjänster
  const kopplingar = [];

  // Erik (index 0) - kan göra Thaimassage, Rygg & Nackmassage, och Duomassage
  const erikTjanster = allaTjanster.filter(
    (t) =>
      t.kategori === "Thaimassage" ||
      t.kategori === "Rygg & Nackmassage" ||
      t.kategori === "Duomassage"
  );
  for (const tjanst of erikTjanster) {
    kopplingar.push({
      utforareId: utforareData[0].id,
      tjanstId: tjanst.id,
    });
  }

  // Anna (index 1) - kan göra Oljemassage och Duomassage
  const annaTjanster = allaTjanster.filter(
    (t) => t.kategori === "Oljemassage" || t.kategori === "Duomassage"
  );
  for (const tjanst of annaTjanster) {
    kopplingar.push({
      utforareId: utforareData[1].id,
      tjanstId: tjanst.id,
    });
  }

  // Maria - kan göra Fotbehandling, Specialmassage, Spa & Relax
  const mariaTjanster = allaTjanster.filter(
    (t) =>
      t.kategori === "Fotbehandling" ||
      t.kategori === "Specialmassage" ||
      t.kategori === "Spa & Relax"
  );
  for (const tjanst of mariaTjanster) {
    kopplingar.push({
      utforareId: utforareData[2].id,
      tjanstId: tjanst.id,
    });
  }

  if (kopplingar.length > 0) {
    await db.insert(utforareTjanster).values(kopplingar);
    console.log(`✅ Created ${kopplingar.length} utförare-tjänst kopplingar`);
  }

  console.log("✅ Utförare seed complete!");
}

seedUtforare()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
