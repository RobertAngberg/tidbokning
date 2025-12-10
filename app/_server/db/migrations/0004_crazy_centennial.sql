CREATE TABLE "utforare_tillganglighet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utforare_id" uuid NOT NULL,
	"veckodag" text NOT NULL,
	"start_tid" time,
	"slut_tid" time,
	"ledig" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "oppettider" DROP CONSTRAINT "oppettider_utforare_id_anvandare_id_fk";
--> statement-breakpoint
ALTER TABLE "oppettider" ALTER COLUMN "foretagsslug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "utforare_tillganglighet" ADD CONSTRAINT "utforare_tillganglighet_utforare_id_anvandare_id_fk" FOREIGN KEY ("utforare_id") REFERENCES "public"."anvandare"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oppettider" DROP COLUMN "utforare_id";