-- Lägg till ordning-kolumn i tjanster för sortering
ALTER TABLE "tjanster" ADD COLUMN IF NOT EXISTS "ordning" integer NOT NULL DEFAULT 0;
