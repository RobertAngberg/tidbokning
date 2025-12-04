import { z } from "zod";

export const bokningSchema = z.object({
  kundNamn: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  kundEmail: z.string().email("Ogiltig e-postadress"),
  kundTelefon: z.string().min(10, "Telefonnummer måste vara minst 10 siffror"),
  tjänstId: z.string().uuid("Ogiltig tjänst"),
  utforareId: z.string().uuid("Ogiltig utförare").optional(),
  startTid: z.date(),
  anteckningar: z.string().optional(),
});

export type BokningInput = z.infer<typeof bokningSchema>;
