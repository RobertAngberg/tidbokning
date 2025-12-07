import { z } from "zod";

const oppettiderSchema = z.object({
  open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Ogiltig tid (HH:MM)"),
  close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Ogiltig tid (HH:MM)"),
  stangt: z.boolean(),
});

export const foretagSchema = z.object({
  namn: z.string().min(1, "Namn krävs").max(255),
  slug: z
    .string()
    .min(1, "Slug krävs")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Endast små bokstäver, siffror och bindestreck"),
  beskrivning: z.string().optional(),

  // Kontaktinformation
  adress: z.string().max(255).optional(),
  postnummer: z.string().max(10).optional(),
  stad: z.string().max(100).optional(),
  telefon: z.string().max(20).optional(),
  email: z.string().email("Ogiltig e-postadress").max(255).optional(),
  webbplats: z.string().url("Ogiltig URL").max(255).optional(),

  // Media
  logoUrl: z.string().url("Ogiltig URL").max(500).optional(),

  // Öppettider
  oppettider: z.record(oppettiderSchema).optional().nullable(),

  // Bokningsinställningar
  timeslotLangd: z.enum(["15", "30", "45", "60"]).default("30"),

  // Tema
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Ogiltig färgkod")
    .default("#000000"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Ogiltig färgkod")
    .default("#ffffff"),

  aktiv: z.boolean().default(true),
});

export type ForetagInput = z.infer<typeof foretagSchema>;
