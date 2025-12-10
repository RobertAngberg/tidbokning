ALTER TABLE "utforare_tillganglighet" DROP CONSTRAINT "utforare_tillganglighet_utforare_id_anvandare_id_fk";
--> statement-breakpoint
ALTER TABLE "utforare_tillganglighet" ADD CONSTRAINT "utforare_tillganglighet_utforare_id_utforare_id_fk" FOREIGN KEY ("utforare_id") REFERENCES "public"."utforare"("id") ON DELETE cascade ON UPDATE no action;