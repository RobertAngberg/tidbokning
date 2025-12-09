import { pgTable, text, uuid, time, boolean } from "drizzle-orm/pg-core";
import { foretag } from "./foretag";

export const oppettider = pgTable("oppettider", {
  id: uuid("id").defaultRandom().primaryKey(),
  foretagsslug: text("foretagsslug")
    .references(() => foretag.slug, { onDelete: "cascade" })
    .notNull(),
  veckodag: text("veckodag").notNull(), // "måndag", "tisdag", etc.
  oppnar: time("oppnar"), // t.ex. "09:00"
  stanger: time("stanger"), // t.ex. "17:00"
  stangt: boolean("stangt").notNull().default(false),
});

export type Oppettid = typeof oppettider.$inferSelect;
export type NyOppettid = typeof oppettider.$inferInsert;
