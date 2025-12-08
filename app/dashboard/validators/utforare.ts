import { z } from "zod";

export const utforareInput = z.object({
  namn: z.string().min(2, "Namnet måste vara minst 2 tecken").max(255),
  email: z.string().email("Ogiltig e-postadress").optional().or(z.literal("")),
  telefon: z.string().max(50).optional().or(z.literal("")),
  beskrivning: z.string().optional().or(z.literal("")),
  bildUrl: z.string().url("Ogiltig URL").optional().or(z.literal("")),
  aktiv: z.boolean().default(true),
  foretagsslug: z.string().min(1, "Företagsslug krävs"),
});

export type UtforareInput = z.infer<typeof utforareInput>;
