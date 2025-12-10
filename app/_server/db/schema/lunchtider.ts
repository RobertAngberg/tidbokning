import { pgTable, text, uuid, date, time, timestamp } from "drizzle-orm/pg-core";
import { foretag } from "./foretag";

export const lunchtider = pgTable("lunchtider", {
  id: uuid("id").defaultRandom().primaryKey(),
  foretagsslug: text("foretagsslug")
    .references(() => foretag.slug, { onDelete: "cascade" })
    .notNull(),
  datum: date("datum").notNull(), // Specifikt datum för lunch
  startTid: time("start_tid").notNull(), // t.ex. "12:00"
  slutTid: time("slut_tid").notNull(), // t.ex. "13:00"
  skapadDatum: timestamp("skapad_datum").defaultNow().notNull(),
});

export type Lunchtid = typeof lunchtider.$inferSelect;
export type NyLunchtid = typeof lunchtider.$inferInsert;
