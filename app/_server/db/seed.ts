import { db } from "./index";
import { tjanster } from "./schema/tjanster";
import { bokningar } from "./schema/bokningar";

async function seed() {
  console.log("🌱 Seeding database...");

  // Ta bort alla befintliga bokningar först (pga foreign key constraint)
  console.log("🗑️  Removing old bookings...");
  await db.delete(bokningar);
  console.log("✅ Old bookings removed");

  // Ta bort alla befintliga tjänster
  console.log("🗑️  Removing old services...");
  await db.delete(tjanster);
  console.log("✅ Old services removed");

  const tjänsterData = [
    {
      namn: "Duomassage 55 min",
      beskrivning:
        "En massage för 2 personer samtidigt i samma rum där man kan välja massage behandling fritt mellan thai, olja eller mix",
      pris: 130000, // 1300 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Duomassage",
    },
    {
      namn: "Duomassage 85",
      beskrivning:
        "Valfri duo massage 85 min där man kan kombinera olika massage och behandlingar för 2 personer samtidigt",
      pris: 190000, // 1900 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Duomassage",
    },
    {
      namn: "Klippkort 5 x 55 min",
      beskrivning:
        "Valfri massage behandling x 55 min gäller 12 mån från inköpsdatum gäller som friskvård",
      pris: 300000, // 3000 kr
      varaktighet: 60,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Klippkort & Paket",
    },
    {
      namn: "Massage Klippkort 5 ggr 55 min",
      beskrivning:
        "Vid klippkort kan du välja valfri behandling och spara upp till 750 kr, klippkortet gäller 12 månader",
      pris: 300000, // 3000 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Klippkort & Paket",
    },
    {
      namn: "Massage Klippkort 10 ggr 55 min",
      beskrivning:
        "Valfri massage behandling som gäller under 12 månader från inköpsdatum, du sparar upp till 2000 kr",
      pris: 550000, // 5500 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Klippkort & Paket",
    },
    {
      namn: "Oljemassage 55 min",
      beskrivning: "Oljemassage mjukgörande för leder o muskler samt avslappning",
      pris: 65000, // 650 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Oljemassage 85",
      beskrivning:
        "Oljemassage helkropp för stela muskler o knutor eller som en avkopplande stund för dig själv",
      pris: 95000, // 950 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Oljemassage 115",
      beskrivning: "Helkroppsmassage där man masserar kroppens muskler o senor o faschia",
      pris: 130000, // 1300 kr
      varaktighet: 115,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Taktil oljemassage 90",
      beskrivning:
        "Oljemassage som följer kroppens linjer och händer o fötter masseras också, en lättare oljemassage",
      pris: 110000, // 1100 kr
      varaktighet: 90,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Flexmassage 85",
      beskrivning:
        "En djupgående massage med olja, men kombinerat med thaimassage och pressur samt avslappning",
      pris: 100000, // 1000 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Akupressur oil massage",
      beskrivning:
        "En oljemassage o tryckpunkter för ont/problem med nacke, axlar, ischias, ländrygg, vader eller lår",
      pris: 80000, // 800 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Svensk klassisk massage 60",
      beskrivning:
        "En helkroppsmassage där man masserar muskler, faschia, senor, med vissa tryckpunkter",
      pris: 65000, // 650 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Svensk klassisk massage 85",
      beskrivning: "Svensk klassisk massage med thaitouch",
      pris: 95000, // 950 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Oljemassage",
    },
    {
      namn: "Thaimassage 55 min",
      beskrivning:
        "Asiatisk traditionell massage med stretch, pressur, som löser spänningar i kroppen",
      pris: 65000, // 650 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Thaimassage",
    },
    {
      namn: "Thaimassage 85",
      beskrivning: "Traditionell massage från Asien",
      pris: 95000, // 950 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Thaimassage",
    },
    {
      namn: "Rygg o nackmassage 30",
      beskrivning: "Rygg o nackmassage",
      pris: 50000, // 500 kr
      varaktighet: 30,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Rygg & Nackmassage",
    },
    {
      namn: "Rygg o nackmassage 55",
      beskrivning:
        "En massage blandad med thaimassage, oilmassage och pressur med koncentration på rygg o nacke o ländrygg",
      pris: 80000, // 800 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Rygg & Nackmassage",
    },
    {
      namn: "Rygg o nackmassage 85",
      beskrivning: "En koncentration på rygg o nacke blandad med thaimassage, oilmassage o pressur",
      pris: 110000, // 1100 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Rygg & Nackmassage",
    },
    {
      namn: "Fotmassage 60 min",
      beskrivning:
        "Fotmassage är en skön o avkopplande massage för trötta fötter o vader och även en kortare massage på nack o skuldra",
      pris: 65000, // 650 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Fotbehandling",
    },
    {
      namn: "Zonterapi 60",
      beskrivning:
        "En fotmassage med både händer o pinne där man masserar fötter o vader och tryckpunkter under o ovan fotsulan",
      pris: 75000, // 750 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Fotbehandling",
    },
    {
      namn: "Fotvård ej medicinsk",
      beskrivning:
        "Fotvård enligt Asiatisk tradition ingår fötter o naglar, förhårdnader, nagelband justering, mjukgörande massage",
      pris: 75000, // 750 kr
      varaktighet: 90,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Fotbehandling",
    },
    {
      namn: "Lymfmassage 60",
      beskrivning:
        "Lymfdränage massage mjukgörande som masseras varsamt mot bestämda punkter i kroppen välgörande o minskar dina problem",
      pris: 90000, // 900 kr
      varaktighet: 60,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Specialmassage",
    },
    {
      namn: "Aroma massage 60",
      beskrivning:
        "En skön avkopplande massage som utföres med en varm olja i långsamma långa drag i massagen",
      pris: 80000, // 800 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Specialmassage",
    },
    {
      namn: "Aroma massage 85",
      beskrivning:
        "En skön avkopplande massage som utföres med en varm olja i långsamma långa drag i massagen",
      pris: 110000, // 1100 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Specialmassage",
    },
    {
      namn: "Hotstone massage 85",
      beskrivning:
        "En varm o avkopplande massage som löser upp dina spänningar o muskler som en relax massage",
      pris: 110000, // 1100 kr
      varaktighet: 85,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Specialmassage",
    },
    {
      namn: "Gravidmassage 60",
      beskrivning:
        "En bra massage där vi ser kvinnans behov i första hand och anpassar massagen efter de o önskemål",
      pris: 80000, // 800 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Specialmassage",
    },
    {
      namn: "Pensionär o student massage 55 min",
      beskrivning:
        "En oljemassage för pensionär o studenter 55 min kan ej kombineras med annan rabatt",
      pris: 60000, // 600 kr
      varaktighet: 55,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Erbjudanden",
    },
    {
      namn: "Spa bad med bastu relax",
      beskrivning:
        "Man hyr relaxen med jacuzzi o bastu privat från 1-10 personer pris 250 kr/tim per person",
      pris: 50000, // 500 kr
      varaktighet: 120,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Spa & Relax",
    },
    {
      namn: "Kärlekspaket för 2",
      beskrivning:
        "Duo massage 60 min och spa bad jacuzzi o sauna 120 min ingår badlakan, tofflor, fruktfat, dricka, choklad",
      pris: 250000, // 2500 kr
      varaktighet: 180,
      aktiv: 1,
      foretagsslug: "default",
      kategori: "Spa & Relax",
    },
  ];

  for (const tjänst of tjänsterData) {
    await db.insert(tjanster).values(tjänst);
    console.log(`✅ Added: ${tjänst.namn}`);
  }

  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
