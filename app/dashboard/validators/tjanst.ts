import { z } from "zod";

export const tjanstSchema = z.object({
  namn: z.string().min(1, "Namn krävs"),
  beskrivning: z.string().optional(),
  varaktighet: z.number().min(15, "Varaktighet måste vara minst 15 minuter"),
  pris: z.number().min(0, "Pris kan inte vara negativt"),
  kategori: z.string().optional(),
  aktiv: z.boolean().default(true),
});

export type TjanstInput = z.infer<typeof tjanstSchema>;
