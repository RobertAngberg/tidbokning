import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { config } from "dotenv";

// Ladda .env.local om vi inte är i Next.js runtime
if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
  config({ path: ".env.local" });
}

if (!process.env.TIDBOKNING_DATABASE_URL) {
  throw new Error("TIDBOKNING_DATABASE_URL saknas i environment variabler");
}

const sql = neon(process.env.TIDBOKNING_DATABASE_URL);
export const db = drizzle(sql, { schema });
