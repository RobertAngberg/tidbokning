// Kör migration för att lägga till ordning-kolumn i tjanster
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.TIDBOKNING_DATABASE_URL!);

async function migrate() {
  try {
    await sql`ALTER TABLE "tjanster" ADD COLUMN IF NOT EXISTS "ordning" integer NOT NULL DEFAULT 0`;
    console.log("Migration lyckades - ordning-kolumn tillagd i tjanster");
  } catch (error) {
    console.error("Migration misslyckades:", error);
  }
}

migrate();
