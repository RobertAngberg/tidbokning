import { db } from "./index";
import { user } from "./schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

async function updateRobertAdmin() {
  console.log("🔄 Uppdaterar Zen Garden Spa admin till Robert...");

  try {
    // Först, ta bort den gamla admin användaren
    await db.delete(user).where(eq(user.email, "admin@zengardenspa.se"));
    console.log("✅ Tog bort gammal admin@zengardenspa.se");

    // Skapa ny användare med Roberts uppgifter
    await auth.api.signUpEmail({
      body: {
        email: "robertangberg@gmail.com",
        password: "Grisen55",
        name: "Robert Angberg",
      },
    });

    // Uppdatera med roll och företag
    await db
      .update(user)
      .set({ roll: "admin", foretagsslug: "zen-garden-spa" })
      .where(eq(user.email, "robertangberg@gmail.com"));

    console.log("✅ Skapade robertangberg@gmail.com med lösenord: Grisen55");
    console.log("   🏢 Företag: zen-garden-spa");
    console.log("\n🎉 Klart! Du kan nu logga in på /dashboard");
  } catch (error) {
    console.error("❌ Fel:", error);
  }
}

updateRobertAdmin()
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
