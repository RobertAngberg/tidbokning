import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const kunder = pgTable("kunder", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  namn: varchar("namn", { length: 255 }).notNull(),
  telefon: varchar("telefon", { length: 20 }),
  foretagsslug: text("foretagsslug"), // Vilket företag kunden först bokade hos (kan vara null för shared kunder)
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum").notNull().defaultNow(),
});

export type Kund = typeof kunder.$inferSelect;
export type NyKund = typeof kunder.$inferInsert;
