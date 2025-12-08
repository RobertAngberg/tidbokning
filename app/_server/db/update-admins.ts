import { db } from "./index";
import { user } from "./schema/auth";
import { eq } from "drizzle-orm";

async function updateAdmins() {
  console.log("🔄 Uppdaterar admin-användare...");

  const updates = [
    { email: "admin@zengardenspa.se", foretagsslug: "zen-garden-spa" },
    { email: "admin@nordicnails.se", foretagsslug: "nordic-nails" },
    { email: "admin@barberco.se", foretagsslug: "barber-co" },
    { email: "admin@fitlifept.se", foretagsslug: "fitlife-pt" },
    { email: "admin@harmonytherapy.se", foretagsslug: "harmony-therapy" },
  ];

  for (const u of updates) {
    await db
      .update(user)
      .set({ roll: "admin", foretagsslug: u.foretagsslug })
      .where(eq(user.email, u.email));
    console.log(`✅ Uppdaterade ${u.email}`);
  }

  console.log("🎉 Klart!");
}

updateAdmins()
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
