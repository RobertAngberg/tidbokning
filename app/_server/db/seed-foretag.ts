import { db } from "./index";
import { foretag } from "./schema/foretag";
import { tjanster } from "./schema/tjanster";
import { utforare, utforareTjanster } from "./schema/utforare";
import { bokningar } from "./schema/bokningar";

async function seedForetag() {
  console.log("🌱 Seeding företag med tjänster och utförare...");

  // Ta bort gammalt innehåll (i rätt ordning pga foreign keys)
  await db.delete(utforareTjanster);
  await db.delete(bokningar);
  await db.delete(tjanster);
  await db.delete(utforare);
  await db.delete(foretag);

  // ===== FÖRETAG 1: Zen Garden Spa =====
  console.log("📦 Skapar Zen Garden Spa...");
  await db
    .insert(foretag)
    .values({
      namn: "Zen Garden Spa",
      slug: "zen-garden-spa",
      beskrivning:
        "Ett exklusivt spa i hjärtat av Stockholm. Vi erbjuder klassiska och moderna behandlingar i lugn och ro. Perfekt för dig som vill koppla av från stadens stress.",
      adress: "Storgatan 15",
      postnummer: "11451",
      stad: "Stockholm",
      telefon: "08-123 45 67",
      email: "info@zengardenspa.se",
      webbplats: "https://zengardenspa.se",
      oppettider: {
        måndag: { open: "09:00", close: "20:00", stangt: false },
        tisdag: { open: "09:00", close: "20:00", stangt: false },
        onsdag: { open: "09:00", close: "20:00", stangt: false },
        torsdag: { open: "09:00", close: "20:00", stangt: false },
        fredag: { open: "09:00", close: "18:00", stangt: false },
        lördag: { open: "10:00", close: "16:00", stangt: false },
        söndag: { open: "10:00", close: "16:00", stangt: false },
      },
      aktiv: true,
    })
    .returning();

  // Zen Garden - Tjänster
  const zenTjanster = await db
    .insert(tjanster)
    .values([
      {
        namn: "Hot Stone Massage",
        beskrivning: "Varma stenar kombineras med avslappnande massage för total djupavkoppling",
        varaktighet: 90,
        pris: 120000,
        foretagsslug: "zen-garden-spa",
        kategori: "Massage",
        aktiv: 1,
      },
      {
        namn: "Ansiktsbehandling Lyxig",
        beskrivning: "Djuprengörande ansiktsbehandling med serum och mask",
        varaktighet: 60,
        pris: 80000,
        foretagsslug: "zen-garden-spa",
        kategori: "Ansiktsbehandling",
        aktiv: 1,
      },
      {
        namn: "Akupunktur",
        beskrivning: "Traditionell kinesisk medicin för balans och hälsa",
        varaktighet: 45,
        pris: 70000,
        foretagsslug: "zen-garden-spa",
        kategori: "Alternativ medicin",
        aktiv: 1,
      },
      {
        namn: "Yoga privat",
        beskrivning: "Personlig yogasession anpassad efter dina behov",
        varaktighet: 60,
        pris: 65000,
        foretagsslug: "zen-garden-spa",
        kategori: "Yoga & Meditation",
        aktiv: 1,
      },
    ])
    .returning();

  // Zen Garden - Utförare
  const zenUtforare = await db
    .insert(utforare)
    .values([
      {
        namn: "Li Wei",
        email: "li@zengardenspa.se",
        telefon: "070-111 11 11",
        beskrivning: "Certifierad massageterapeut med 15 års erfarenhet från Kina",
        aktiv: true,
        foretagsslug: "zen-garden-spa",
      },
      {
        namn: "Emma Lundström",
        email: "emma@zengardenspa.se",
        telefon: "070-222 22 22",
        beskrivning: "Hudterapeut och yogainstruktör",
        aktiv: true,
        foretagsslug: "zen-garden-spa",
      },
    ])
    .returning();

  // Koppla utförare till tjänster
  await db.insert(utforareTjanster).values([
    { utforareId: zenUtforare[0].id, tjanstId: zenTjanster[0].id },
    { utforareId: zenUtforare[0].id, tjanstId: zenTjanster[2].id },
    { utforareId: zenUtforare[1].id, tjanstId: zenTjanster[1].id },
    { utforareId: zenUtforare[1].id, tjanstId: zenTjanster[3].id },
  ]);

  console.log("✅ Zen Garden Spa klar!");

  // ===== FÖRETAG 2: Nordic Nails Studio =====
  console.log("📦 Skapar Nordic Nails Studio...");
  await db.insert(foretag).values({
    namn: "Nordic Nails Studio",
    slug: "nordic-nails",
    beskrivning:
      "Professionell nagelvård i moderna lokaler. Vi använder endast miljövänliga produkter och erbjuder allt från klassisk manikyr till nail art.",
    adress: "Drottninggatan 88",
    postnummer: "11136",
    stad: "Stockholm",
    telefon: "08-234 56 78",
    email: "boka@nordicnails.se",
    webbplats: "https://nordicnails.se",
    oppettider: {
      måndag: { open: "10:00", close: "19:00", stangt: false },
      tisdag: { open: "10:00", close: "19:00", stangt: false },
      onsdag: { open: "10:00", close: "19:00", stangt: false },
      torsdag: { open: "10:00", close: "19:00", stangt: false },
      fredag: { open: "10:00", close: "19:00", stangt: false },
      lördag: { open: "09:00", close: "15:00", stangt: false },
      söndag: { open: "10:00", close: "14:00", stangt: false },
    },
    aktiv: true,
  });

  const nailsTjanster = await db
    .insert(tjanster)
    .values([
      {
        namn: "Gellack",
        beskrivning: "Hållbar gellack som håller i 3-4 veckor",
        varaktighet: 45,
        pris: 40000,
        foretagsslug: "nordic-nails",
        kategori: "Naglar",
        aktiv: 1,
      },
      {
        namn: "Gelé/Akryl nytt set",
        beskrivning: "Helt nya konstgjorda naglar med gelé eller akryl",
        varaktighet: 120,
        pris: 80000,
        foretagsslug: "nordic-nails",
        kategori: "Naglar",
        aktiv: 1,
      },
      {
        namn: "Pedikyr Spa",
        beskrivning: "Lyxig fotbehandling med bad, skrubb och massage",
        varaktighet: 60,
        pris: 55000,
        foretagsslug: "nordic-nails",
        kategori: "Fötter",
        aktiv: 1,
      },
      {
        namn: "Nail Art",
        beskrivning: "Kreativa nageldesigns efter dina önskemål",
        varaktighet: 30,
        pris: 30000,
        foretagsslug: "nordic-nails",
        kategori: "Naglar",
        aktiv: 1,
      },
    ])
    .returning();

  const nailsUtforare = await db
    .insert(utforare)
    .values([
      {
        namn: "Sofia Bergström",
        email: "sofia@nordicnails.se",
        telefon: "070-333 33 33",
        beskrivning: "Nagelteknolog med specialisering på nail art",
        aktiv: true,
        foretagsslug: "nordic-nails",
      },
      {
        namn: "Maya Pettersson",
        email: "maya@nordicnails.se",
        telefon: "070-444 44 44",
        beskrivning: "Certifierad nagelteknolog och pedikurist",
        aktiv: true,
        foretagsslug: "nordic-nails",
      },
    ])
    .returning();

  await db.insert(utforareTjanster).values([
    { utforareId: nailsUtforare[0].id, tjanstId: nailsTjanster[0].id },
    { utforareId: nailsUtforare[0].id, tjanstId: nailsTjanster[1].id },
    { utforareId: nailsUtforare[0].id, tjanstId: nailsTjanster[3].id },
    { utforareId: nailsUtforare[1].id, tjanstId: nailsTjanster[0].id },
    { utforareId: nailsUtforare[1].id, tjanstId: nailsTjanster[2].id },
  ]);

  console.log("✅ Nordic Nails Studio klar!");

  // ===== FÖRETAG 3: Barber & Co =====
  console.log("📦 Skapar Barber & Co...");
  await db.insert(foretag).values({
    namn: "Barber & Co",
    slug: "barber-co",
    beskrivning:
      "Klassisk barbering för den moderna mannen. Expertis, kvalitet och tradition sedan 2015. Välkommen till oss för klippning, skägg och rakning.",
    adress: "Kungsgatan 42",
    postnummer: "11135",
    stad: "Stockholm",
    telefon: "08-345 67 89",
    email: "kontakt@barberco.se",
    webbplats: "https://barberco.se",
    oppettider: {
      måndag: { open: "09:00", close: "19:00", stangt: false },
      tisdag: { open: "09:00", close: "19:00", stangt: false },
      onsdag: { open: "09:00", close: "19:00", stangt: false },
      torsdag: { open: "09:00", close: "20:00", stangt: false },
      fredag: { open: "09:00", close: "19:00", stangt: false },
      lördag: { open: "10:00", close: "16:00", stangt: false },
      söndag: { open: "00:00", close: "00:00", stangt: true },
    },
    aktiv: true,
  });

  const barberTjanster = await db
    .insert(tjanster)
    .values([
      {
        namn: "Herrklippning",
        beskrivning: "Klassisk herrklippning med sax och maskin",
        varaktighet: 30,
        pris: 35000,
        foretagsslug: "barber-co",
        kategori: "Hår",
        aktiv: 1,
      },
      {
        namn: "Skäggtrimning",
        beskrivning: "Professionell trimning och formning av skägg",
        varaktighet: 20,
        pris: 25000,
        foretagsslug: "barber-co",
        kategori: "Skägg",
        aktiv: 1,
      },
      {
        namn: "Rakning med kniv",
        beskrivning: "Traditionell rakning med varma handdukar och rakkniv",
        varaktighet: 45,
        pris: 45000,
        foretagsslug: "barber-co",
        kategori: "Skägg",
        aktiv: 1,
      },
      {
        namn: "Kombo: Klippning + Skägg",
        beskrivning: "Herrklippning och skäggtrimning i ett paket",
        varaktighet: 50,
        pris: 50000,
        foretagsslug: "barber-co",
        kategori: "Paket",
        aktiv: 1,
      },
    ])
    .returning();

  const barberUtforare = await db
    .insert(utforare)
    .values([
      {
        namn: "Viktor Karlsson",
        email: "viktor@barberco.se",
        telefon: "070-555 55 55",
        beskrivning: "Mästarbarberar med 20 års erfarenhet",
        aktiv: true,
        foretagsslug: "barber-co",
      },
      {
        namn: "Oliver Lindgren",
        email: "oliver@barberco.se",
        telefon: "070-666 66 66",
        beskrivning: "Stilmedveten frisör specialiserad på moderna klippningar",
        aktiv: true,
        foretagsslug: "barber-co",
      },
    ])
    .returning();

  await db.insert(utforareTjanster).values([
    { utforareId: barberUtforare[0].id, tjanstId: barberTjanster[0].id },
    { utforareId: barberUtforare[0].id, tjanstId: barberTjanster[1].id },
    { utforareId: barberUtforare[0].id, tjanstId: barberTjanster[2].id },
    { utforareId: barberUtforare[0].id, tjanstId: barberTjanster[3].id },
    { utforareId: barberUtforare[1].id, tjanstId: barberTjanster[0].id },
    { utforareId: barberUtforare[1].id, tjanstId: barberTjanster[1].id },
    { utforareId: barberUtforare[1].id, tjanstId: barberTjanster[3].id },
  ]);

  console.log("✅ Barber & Co klar!");

  // ===== FÖRETAG 4: FitLife PT =====
  console.log("📦 Skapar FitLife PT...");
  await db.insert(foretag).values({
    namn: "FitLife PT",
    slug: "fitlife-pt",
    beskrivning:
      "Personlig träning för alla nivåer. Vi hjälper dig nå dina träningsmål genom skräddarsydda program och professionell coaching i vår moderna träningslokal.",
    adress: "Sveavägen 123",
    postnummer: "11357",
    stad: "Stockholm",
    telefon: "08-456 78 90",
    email: "hello@fitlifept.se",
    webbplats: "https://fitlifept.se",
    oppettider: {
      måndag: { open: "06:00", close: "21:00", stangt: false },
      tisdag: { open: "06:00", close: "21:00", stangt: false },
      onsdag: { open: "06:00", close: "21:00", stangt: false },
      torsdag: { open: "06:00", close: "21:00", stangt: false },
      fredag: { open: "06:00", close: "20:00", stangt: false },
      lördag: { open: "08:00", close: "18:00", stangt: false },
      söndag: { open: "09:00", close: "16:00", stangt: false },
    },
    aktiv: true,
  });

  const fitnessTjanster = await db
    .insert(tjanster)
    .values([
      {
        namn: "PT-session 60 min",
        beskrivning: "Personlig träning med skräddarsytt program",
        varaktighet: 60,
        pris: 60000,
        foretagsslug: "fitlife-pt",
        kategori: "Personlig träning",
        aktiv: 1,
      },
      {
        namn: "Nutritionsrådgivning",
        beskrivning: "Personlig kostplan och rådgivning",
        varaktighet: 45,
        pris: 50000,
        foretagsslug: "fitlife-pt",
        kategori: "Näring",
        aktiv: 1,
      },
      {
        namn: "Kroppsanalys",
        beskrivning: "Fullständig kroppsanalys med InBody-skanning",
        varaktighet: 30,
        pris: 40000,
        foretagsslug: "fitlife-pt",
        kategori: "Analys",
        aktiv: 1,
      },
      {
        namn: "Gruppträning Bootcamp",
        beskrivning: "Intensiv träning i grupp (max 8 personer)",
        varaktighet: 45,
        pris: 25000,
        foretagsslug: "fitlife-pt",
        kategori: "Gruppträning",
        aktiv: 1,
      },
      {
        namn: "Klippkort 10 sessioner",
        beskrivning: "10 PT-sessioner à 60 minuter, spara 1000 kr",
        varaktighet: 60,
        pris: 500000,
        foretagsslug: "fitlife-pt",
        kategori: "Paket",
        aktiv: 1,
      },
    ])
    .returning();

  const fitnessUtforare = await db
    .insert(utforare)
    .values([
      {
        namn: "Marcus Holm",
        email: "marcus@fitlifept.se",
        telefon: "070-777 77 77",
        beskrivning: "Certifierad personlig tränare och nutritionist",
        aktiv: true,
        foretagsslug: "fitlife-pt",
      },
      {
        namn: "Sarah Johansson",
        email: "sarah@fitlifept.se",
        telefon: "070-888 88 88",
        beskrivning: "Konditionscoach och gruppträningsinstruktör",
        aktiv: true,
        foretagsslug: "fitlife-pt",
      },
    ])
    .returning();

  await db.insert(utforareTjanster).values([
    { utforareId: fitnessUtforare[0].id, tjanstId: fitnessTjanster[0].id },
    { utforareId: fitnessUtforare[0].id, tjanstId: fitnessTjanster[1].id },
    { utforareId: fitnessUtforare[0].id, tjanstId: fitnessTjanster[2].id },
    { utforareId: fitnessUtforare[0].id, tjanstId: fitnessTjanster[4].id },
    { utforareId: fitnessUtforare[1].id, tjanstId: fitnessTjanster[0].id },
    { utforareId: fitnessUtforare[1].id, tjanstId: fitnessTjanster[3].id },
    { utforareId: fitnessUtforare[1].id, tjanstId: fitnessTjanster[4].id },
  ]);

  console.log("✅ FitLife PT klar!");

  // ===== FÖRETAG 5: Harmony Therapy Center =====
  console.log("📦 Skapar Harmony Therapy Center...");
  await db.insert(foretag).values({
    namn: "Harmony Therapy Center",
    slug: "harmony-therapy",
    beskrivning:
      "Holistisk hälsoklinik som kombinerar psykoterapi, coaching och kroppsterapi. Vi arbetar med hela människan för varaktiga resultat och inre harmoni.",
    adress: "Birger Jarlsgatan 20",
    postnummer: "11434",
    stad: "Stockholm",
    telefon: "08-567 89 01",
    email: "info@harmonytherapy.se",
    webbplats: "https://harmonytherapy.se",
    oppettider: {
      måndag: { open: "08:00", close: "18:00", stangt: false },
      tisdag: { open: "08:00", close: "18:00", stangt: false },
      onsdag: { open: "08:00", close: "18:00", stangt: false },
      torsdag: { open: "08:00", close: "19:00", stangt: false },
      fredag: { open: "08:00", close: "17:00", stangt: false },
      lördag: { open: "10:00", close: "14:00", stangt: false },
      söndag: { open: "00:00", close: "00:00", stangt: true },
    },
    aktiv: true,
  });

  const therapyTjanster = await db
    .insert(tjanster)
    .values([
      {
        namn: "Psykoterapi 50 min",
        beskrivning: "Individuell samtalsterapi med legitimerad psykoterapeut",
        varaktighet: 50,
        pris: 90000,
        foretagsslug: "harmony-therapy",
        kategori: "Psykoterapi",
        aktiv: 1,
      },
      {
        namn: "Livscoaching",
        beskrivning: "Målsättning och personlig utveckling",
        varaktighet: 60,
        pris: 80000,
        foretagsslug: "harmony-therapy",
        kategori: "Coaching",
        aktiv: 1,
      },
      {
        namn: "Parterapi",
        beskrivning: "Samtalsterapi för par i kris eller för utveckling",
        varaktighet: 90,
        pris: 140000,
        foretagsslug: "harmony-therapy",
        kategori: "Psykoterapi",
        aktiv: 1,
      },
      {
        namn: "Mindfulness-kurs",
        beskrivning: "8-veckors program för stresshantering (ingår 8 sessioner)",
        varaktighet: 120,
        pris: 400000,
        foretagsslug: "harmony-therapy",
        kategori: "Kurser",
        aktiv: 1,
      },
      {
        namn: "Stresshantering",
        beskrivning: "Individuell behandling för stress och utmattning",
        varaktighet: 60,
        pris: 85000,
        foretagsslug: "harmony-therapy",
        kategori: "Specialbehandling",
        aktiv: 1,
      },
    ])
    .returning();

  const therapyUtforare = await db
    .insert(utforare)
    .values([
      {
        namn: "Dr. Helena Forsberg",
        email: "helena@harmonytherapy.se",
        telefon: "070-999 99 99",
        beskrivning: "Legitimerad psykolog och psykoterapeut, specialist i KBT",
        aktiv: true,
        foretagsslug: "harmony-therapy",
      },
      {
        namn: "Johan Eriksson",
        email: "johan@harmonytherapy.se",
        telefon: "070-101 01 01",
        beskrivning: "Certifierad livscoach och mindfulness-instruktör",
        aktiv: true,
        foretagsslug: "harmony-therapy",
      },
    ])
    .returning();

  await db.insert(utforareTjanster).values([
    { utforareId: therapyUtforare[0].id, tjanstId: therapyTjanster[0].id },
    { utforareId: therapyUtforare[0].id, tjanstId: therapyTjanster[2].id },
    { utforareId: therapyUtforare[0].id, tjanstId: therapyTjanster[4].id },
    { utforareId: therapyUtforare[1].id, tjanstId: therapyTjanster[1].id },
    { utforareId: therapyUtforare[1].id, tjanstId: therapyTjanster[3].id },
    { utforareId: therapyUtforare[1].id, tjanstId: therapyTjanster[4].id },
  ]);

  console.log("✅ Harmony Therapy Center klar!");

  console.log("\n🎉 Alla 5 företag med tjänster och utförare har skapats!");
}

seedForetag()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
