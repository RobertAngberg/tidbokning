import { db } from "./index";
import { user } from "./schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

async function seedAdmins() {
  console.log("🔑 Skapar admin-användare för alla företag...");

  const admins = [
    {
      email: "admin@zengardenspa.se",
      password: "password123",
      namn: "Zen Garden Admin",
      foretagsslug: "zen-garden-spa",
    },
    {
      email: "admin@nordicnails.se",
      password: "password123",
      namn: "Nordic Nails Admin",
      foretagsslug: "nordic-nails",
    },
    {
      email: "admin@barberco.se",
      password: "password123",
      namn: "Barber & Co Admin",
      foretagsslug: "barber-co",
    },
    {
      email: "admin@fitlifept.se",
      password: "password123",
      namn: "FitLife PT Admin",
      foretagsslug: "fitlife-pt",
    },
    {
      email: "admin@harmonytherapy.se",
      password: "password123",
      namn: "Harmony Therapy Admin",
      foretagsslug: "harmony-therapy",
    },
  ];

  for (const admin of admins) {
    try {
      // Skapa användare via Better Auth API
      await auth.api.signUpEmail({
        body: {
          email: admin.email,
          password: admin.password,
          name: admin.namn,
        },
      });

      // Uppdatera user-tabellen med roll och företag
      await db
        .update(user)
        .set({
          roll: "admin",
          foretagsslug: admin.foretagsslug,
        })
        .where(eq(user.email, admin.email));

      console.log(`✅ Skapade ${admin.namn} (${admin.email})`);
      console.log(`   🏢 Företag: ${admin.foretagsslug}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("already exists")) {
        console.log(`⏭️  ${admin.namn} finns redan`);
      } else {
        console.error(`❌ Fel vid skapande av ${admin.namn}:`, errorMessage);
      }
    }
  }

  console.log("\n🎉 Alla admin-användare skapade!");
  console.log("\nInloggningsuppgifter:");
  console.log("========================");
  admins.forEach((admin) => {
    console.log(`${admin.namn}:`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Lösenord: ${admin.password}`);
    console.log(`  Företag: ${admin.foretagsslug}`);
    console.log("");
  });
}

seedAdmins()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
