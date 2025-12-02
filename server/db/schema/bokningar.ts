import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { anvandare } from "./anvandare";
import { tjanster } from "./tjanster";

export const bokningar = pgTable("bokningar", {
  id: uuid("id").defaultRandom().primaryKey(),
  kundId: uuid("kund_id").references(() => anvandare.id).notNull(),
  personalId: uuid("personal_id").references(() => anvandare.id),
  tjanstId: uuid("tjanst_id").references(() => tjanster.id).notNull(),
  startTid: timestamp("start_tid").notNull(),
  slutTid: timestamp("slut_tid").notNull(),
  status: text("status", { 
    enum: ["bekraftad", "vaentande", "installld", "slutford"] 
  }).notNull().default("vaentande"),
  anteckningar: text("anteckningar"),
  foretagsslug: text("foretagsslug").notNull(),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export type Bokning = typeof bokningar.$inferSelect;
export type NyBokning = typeof bokningar.$inferInsert;
