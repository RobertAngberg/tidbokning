import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as anvandareSchema from "./schema/anvandare";
import * as bokningarSchema from "./schema/bokningar";
import * as tjansterSchema from "./schema/tjanster";
import * as utforareSchema from "./schema/utforare";
import * as oppettiderSchema from "./schema/oppettider";
import * as authSchema from "./schema/auth";
import { config } from "dotenv";

const schema = {
  ...anvandareSchema,
  ...bokningarSchema,
  ...tjansterSchema,
  ...utforareSchema,
  ...oppettiderSchema,
  ...authSchema,
};

// Ladda .env.local om vi inte är i Next.js runtime
if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
  config({ path: ".env.local" });
}

if (!process.env.TIDBOKNING_DATABASE_URL) {
  throw new Error("TIDBOKNING_DATABASE_URL saknas i environment variabler");
}

const sql = neon(process.env.TIDBOKNING_DATABASE_URL);
export const db = drizzle(sql, { schema });
