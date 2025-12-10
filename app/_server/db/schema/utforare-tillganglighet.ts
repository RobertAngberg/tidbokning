import { pgTable, text, uuid, time, boolean } from "drizzle-orm/pg-core";
import { utforare } from "./utforare";

// Utförares tillgänglighet - när de KAN jobba (inom företagets öppettider)
export const utforareTillganglighet = pgTable("utforare_tillganglighet", {
  id: uuid("id").defaultRandom().primaryKey(),
  utforareId: uuid("utforare_id")
    .references(() => utforare.id, { onDelete: "cascade" })
    .notNull(),
  veckodag: text("veckodag").notNull(), // "måndag", "tisdag", etc.
  startTid: time("start_tid"), // t.ex. "10:00"
  slutTid: time("slut_tid"), // t.ex. "15:00"
  ledig: boolean("ledig").notNull().default(true), // true = tillgänglig, false = ej tillgänglig
});

export type UtforareTillganglighet = typeof utforareTillganglighet.$inferSelect;
export type NyUtforareTillganglighet = typeof utforareTillganglighet.$inferInsert;
