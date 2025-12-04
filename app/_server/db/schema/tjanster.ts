import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const tjanster = pgTable("tjanster", {
  id: uuid("id").defaultRandom().primaryKey(),
  namn: text("namn").notNull(),
  beskrivning: text("beskrivning"),
  varaktighet: integer("varaktighet").notNull(), // minuter
  pris: integer("pris").notNull(), // i ören
  foretagsslug: text("foretagsslug").notNull(),
  kategori: text("kategori"), // kategori för gruppering
  aktiv: integer("aktiv").notNull().default(1), // 1 = aktiv, 0 = inaktiv
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export type Tjanst = typeof tjanster.$inferSelect;
export type NyTjanst = typeof tjanster.$inferInsert;
