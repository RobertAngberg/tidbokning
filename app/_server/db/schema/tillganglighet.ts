import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { anvandare } from "./anvandare";

export const tillganglighet = pgTable("tillganglighet", {
  id: uuid("id").defaultRandom().primaryKey(),
  personalId: uuid("personal_id").references(() => anvandare.id).notNull(),
  veckodag: integer("veckodag").notNull(), // 0-6 (söndag-lördag)
  startTid: text("start_tid").notNull(), // HH:MM format
  slutTid: text("slut_tid").notNull(), // HH:MM format
  foretagsslug: text("foretagsslug").notNull(),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export type Tillganglighet = typeof tillganglighet.$inferSelect;
export type NyTillganglighet = typeof tillganglighet.$inferInsert;
