import { z } from "zod";

export const bokningSchema = z.object({
  kundNamn: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  kundEmail: z.string().email("Ogiltig e-postadress"),
  tjänstId: z.string().uuid("Ogiltig tjänst"),
  startTid: z.date(),
});

export type BokningInput = z.infer<typeof bokningSchema>;
