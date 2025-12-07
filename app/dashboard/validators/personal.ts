import { z } from "zod";

export const personalInput = z.object({
  namn: z.string().min(1, "Namn är obligatoriskt"),
  email: z.string().email("Ogiltig email-adress"),
  telefon: z.string().optional(),
  bio: z.string().optional(),
  profilbildUrl: z.string().url("Ogiltig URL").optional().or(z.literal("")),
  aktiv: z.boolean().default(true),
});

export type PersonalInput = z.infer<typeof personalInput>;
