import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tjanster } from "./tjanster";

export const kategorier = pgTable("kategorier", {
  id: uuid("id").defaultRandom().primaryKey(),
  namn: text("namn").notNull(),
  beskrivning: text("beskrivning"),
  foretagsslug: text("foretagsslug").notNull(),
  ordning: integer("ordning").notNull().default(0), // för sortering
  aktiv: integer("aktiv").notNull().default(1), // 1 = aktiv, 0 = inaktiv
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export const kategoriRelations = relations(kategorier, ({ many }) => ({
  tjanster: many(tjanster),
}));

export type Kategori = typeof kategorier.$inferSelect;
export type NyKategori = typeof kategorier.$inferInsert;
