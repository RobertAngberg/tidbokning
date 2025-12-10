ALTER TABLE "oppettider" ALTER COLUMN "foretagsslug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "oppettider" ADD COLUMN "utforare_id" uuid;--> statement-breakpoint
ALTER TABLE "oppettider" ADD CONSTRAINT "oppettider_utforare_id_anvandare_id_fk" FOREIGN KEY ("utforare_id") REFERENCES "public"."anvandare"("id") ON DELETE cascade ON UPDATE no action;