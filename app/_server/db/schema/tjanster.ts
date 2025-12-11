import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { utforareTjanster } from "./utforare";
import { kategorier } from "./kategorier";

export const tjanster = pgTable("tjanster", {
  id: uuid("id").defaultRandom().primaryKey(),
  namn: text("namn").notNull(),
  beskrivning: text("beskrivning"),
  varaktighet: integer("varaktighet").notNull(), // minuter
  pris: integer("pris").notNull(), // i ören
  foretagsslug: text("foretagsslug").notNull(),
  kategoriId: uuid("kategori_id").references(() => kategorier.id, { onDelete: "set null" }), // FK till kategorier
  ordning: integer("ordning").notNull().default(0), // för sortering
  aktiv: integer("aktiv").notNull().default(1), // 1 = aktiv, 0 = inaktiv
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export const tjansterRelations = relations(tjanster, ({ many, one }) => ({
  utforareTjanster: many(utforareTjanster),
  kategori: one(kategorier, {
    fields: [tjanster.kategoriId],
    references: [kategorier.id],
  }),
}));

export type Tjanst = typeof tjanster.$inferSelect;
export type NyTjanst = typeof tjanster.$inferInsert;
