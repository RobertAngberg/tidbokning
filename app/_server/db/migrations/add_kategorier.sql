-- Skapa kategorier-tabellen
CREATE TABLE IF NOT EXISTS "kategorier" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "namn" text NOT NULL,
  "beskrivning" text,
  "foretagsslug" text NOT NULL,
  "ordning" integer DEFAULT 0 NOT NULL,
  "aktiv" integer DEFAULT 1 NOT NULL,
  "skapad_datum" timestamp DEFAULT now() NOT NULL,
  "uppdaterad_datum" timestamp DEFAULT now() NOT NULL
);

-- Lägg till kategori_id kolumn till tjanster
ALTER TABLE "tjanster" ADD COLUMN IF NOT EXISTS "kategori_id" uuid;

-- Lägg till foreign key constraint
ALTER TABLE "tjanster" 
ADD CONSTRAINT "tjanster_kategori_id_kategorier_id_fk" 
FOREIGN KEY ("kategori_id") 
REFERENCES "kategorier"("id") 
ON DELETE SET NULL;

-- Ta bort gamla kategori text-kolumnen (valfritt, bara om den finns)
-- ALTER TABLE "tjanster" DROP COLUMN IF EXISTS "kategori";
