import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tjanster } from "./tjanster";

export const utforare = pgTable("utforare", {
  id: uuid("id").defaultRandom().primaryKey(),
  namn: text("namn").notNull(),
  email: text("email"),
  telefon: text("telefon"),
  beskrivning: text("beskrivning"),
  bildUrl: text("bild_url"),
  aktiv: boolean("aktiv").notNull().default(true),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

// Kopplingstabellen mellan utförare och tjänster
export const utforareTjanster = pgTable("utforare_tjanster", {
  id: uuid("id").defaultRandom().primaryKey(),
  utforareId: uuid("utforare_id")
    .references(() => utforare.id, { onDelete: "cascade" })
    .notNull(),
  tjanstId: uuid("tjanst_id")
    .references(() => tjanster.id, { onDelete: "cascade" })
    .notNull(),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
});

export const utforareRelations = relations(utforare, ({ many }) => ({
  utforareTjanster: many(utforareTjanster),
}));

export const utforareTjansterRelations = relations(utforareTjanster, ({ one }) => ({
  utforare: one(utforare, {
    fields: [utforareTjanster.utforareId],
    references: [utforare.id],
  }),
  tjanst: one(tjanster, {
    fields: [utforareTjanster.tjanstId],
    references: [tjanster.id],
  }),
}));

export type Utforare = typeof utforare.$inferSelect;
export type NyUtforare = typeof utforare.$inferInsert;
export type UtforareTjanst = typeof utforareTjanster.$inferSelect;
export type NyUtforareTjanst = typeof utforareTjanster.$inferInsert;
