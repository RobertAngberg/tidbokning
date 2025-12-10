import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { kunder } from "./kunder";
import { anvandare } from "./anvandare";
import { tjanster } from "./tjanster";
import { utforare } from "./utforare";

export const bokningar = pgTable("bokningar", {
  id: uuid("id").defaultRandom().primaryKey(),
  kundId: uuid("kund_id")
    .references(() => kunder.id)
    .notNull(),
  personalId: uuid("personal_id").references(() => anvandare.id),
  tjanstId: uuid("tjanst_id")
    .references(() => tjanster.id)
    .notNull(),
  utforareId: uuid("utforare_id").references(() => utforare.id),
  startTid: timestamp("start_tid").notNull(),
  slutTid: timestamp("slut_tid").notNull(),
  status: text("status", {
    enum: ["Bekräftad", "Väntande", "Inställd", "Slutförd"],
  })
    .notNull()
    .default("Väntande"),
  anteckningar: text("anteckningar"),
  foretagsslug: text("foretagsslug").notNull(),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export const bokningarRelations = relations(bokningar, ({ one }) => ({
  kund: one(kunder, {
    fields: [bokningar.kundId],
    references: [kunder.id],
  }),
  tjanst: one(tjanster, {
    fields: [bokningar.tjanstId],
    references: [tjanster.id],
  }),
  utforare: one(utforare, {
    fields: [bokningar.utforareId],
    references: [utforare.id],
  }),
}));

export type Bokning = typeof bokningar.$inferSelect;
export type NyBokning = typeof bokningar.$inferInsert;
