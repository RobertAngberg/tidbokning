import { pgTable, text, varchar, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tjanster } from "./tjanster";

export const personal = pgTable("personal", {
  id: uuid("id").defaultRandom().primaryKey(),
  namn: varchar("namn", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  telefon: varchar("telefon", { length: 50 }),
  bio: text("bio"),
  profilbildUrl: text("profilbild_url"),
  aktiv: integer("aktiv").notNull().default(1), // 1 = aktiv, 0 = inaktiv
  skapadDatum: timestamp("skapad_datum", { mode: "date" }).notNull().defaultNow(),
  uppdateradDatum: timestamp("uppdaterad_datum", { mode: "date" }).notNull().defaultNow(),
});

// Junction table för many-to-many relation mellan personal och tjänster
export const personalTjanster = pgTable("personal_tjanster", {
  personalId: uuid("personal_id")
    .notNull()
    .references(() => personal.id, { onDelete: "cascade" }),
  tjanstId: uuid("tjanst_id")
    .notNull()
    .references(() => tjanster.id, { onDelete: "cascade" }),
});

export const personalRelations = relations(personal, ({ many }) => ({
  tjanster: many(personalTjanster),
}));

export const personalTjansterRelations = relations(personalTjanster, ({ one }) => ({
  personal: one(personal, {
    fields: [personalTjanster.personalId],
    references: [personal.id],
  }),
  tjanst: one(tjanster, {
    fields: [personalTjanster.tjanstId],
    references: [tjanster.id],
  }),
}));

export type Personal = typeof personal.$inferSelect;
export type NyPersonal = typeof personal.$inferInsert;
