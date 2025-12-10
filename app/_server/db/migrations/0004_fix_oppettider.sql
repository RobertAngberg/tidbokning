-- Ta bort utforare_id från oppettider (den ska inte vara där)
ALTER TABLE "oppettider" DROP COLUMN IF EXISTS "utforare_id";
