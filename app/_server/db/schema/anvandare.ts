import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const anvandare = pgTable("anvandare", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  namn: text("namn").notNull(),
  telefon: text("telefon"),
  roll: text("roll", { enum: ["admin", "personal", "kund"] }).notNull().default("kund"),
  foretagsslug: text("foretagsslug"),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export type Anvandare = typeof anvandare.$inferSelect;
export type NyAnvandare = typeof anvandare.$inferInsert;
