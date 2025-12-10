import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { kunder } from "./kunder";
import { bokningar } from "./bokningar";

export const recensioner = pgTable("recensioner", {
  id: uuid("id").defaultRandom().primaryKey(),
  kundId: uuid("kund_id")
    .references(() => kunder.id)
    .notNull(),
  bokningId: uuid("bokning_id")
    .references(() => bokningar.id)
    .notNull()
    .unique(), // En recension per bokning
  foretagsslug: text("foretagsslug").notNull(),
  betyg: integer("betyg").notNull(), // 1-5 stjärnor
  kommentar: text("kommentar"),
  skapadDatum: timestamp("skapad_datum").notNull().defaultNow(),
});

export const recensionerRelations = relations(recensioner, ({ one }) => ({
  kund: one(kunder, {
    fields: [recensioner.kundId],
    references: [kunder.id],
  }),
  bokning: one(bokningar, {
    fields: [recensioner.bokningId],
    references: [bokningar.id],
  }),
}));

export type Recension = typeof recensioner.$inferSelect;
export type NyRecension = typeof recensioner.$inferInsert;
