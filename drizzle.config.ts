import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./app/_server/db/schema/index.ts",
  out: "./app/_server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.TIDBOKNING_DATABASE_URL!,
  },
});
