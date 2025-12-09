import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { foretag } from "./foretag";

export const foretagBilder = pgTable("foretag_bilder", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  foretagsslug: varchar("foretagsslug", { length: 255 })
    .notNull()
    .references(() => foretag.slug, { onDelete: "cascade" }),
  bildUrl: text("bild_url").notNull(),
  beskrivning: text("beskrivning"),
  sorteringsordning: integer("sorteringsordning").default(0).notNull(),
  skapadDatum: timestamp("skapad_datum", { mode: "date" }).defaultNow().notNull(),
});

export type ForetagBild = typeof foretagBilder.$inferSelect;
export type NyForetagBild = typeof foretagBilder.$inferInsert;
