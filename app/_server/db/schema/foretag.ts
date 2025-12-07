import { pgTable, text, varchar, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export const foretag = pgTable("foretag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  namn: varchar("namn", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  beskrivning: text("beskrivning"),

  // Kontaktinformation
  adress: varchar("adress", { length: 255 }),
  postnummer: varchar("postnummer", { length: 10 }),
  stad: varchar("stad", { length: 100 }),
  telefon: varchar("telefon", { length: 20 }),
  email: varchar("email", { length: 255 }),
  webbplats: varchar("webbplats", { length: 255 }),

  // Media
  logoUrl: varchar("logo_url", { length: 500 }),

  // Öppettider (JSON: { måndag: { open: "09:00", close: "17:00", stängt: false }, ... })
  oppettider: jsonb("oppettider").$type<{
    [key: string]: {
      open: string;
      close: string;
      stangt: boolean;
    };
  }>(),

  // Bokningsinställningar
  timeslotLangd: varchar("timeslot_langd", { length: 10 }).default("30"), // "15", "30", "45", "60"

  // Tema
  primaryColor: varchar("primary_color", { length: 7 }).default("#000000"),
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#ffffff"),

  aktiv: boolean("aktiv").default(true).notNull(),
  skapadVid: timestamp("skapad_vid").defaultNow().notNull(),
  uppdateradVid: timestamp("uppdaterad_vid").defaultNow().notNull(),
});

export type Foretag = typeof foretag.$inferSelect;
export type NyttForetag = typeof foretag.$inferInsert;
