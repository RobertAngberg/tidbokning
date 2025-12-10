CREATE TABLE "recensioner" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kund_id" uuid NOT NULL,
	"bokning_id" uuid NOT NULL,
	"foretagsslug" text NOT NULL,
	"betyg" integer NOT NULL,
	"kommentar" text,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recensioner_bokning_id_unique" UNIQUE("bokning_id")
);
--> statement-breakpoint
CREATE TABLE "lunchtider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"foretagsslug" text NOT NULL,
	"datum" date NOT NULL,
	"start_tid" time NOT NULL,
	"slut_tid" time NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recensioner" ADD CONSTRAINT "recensioner_kund_id_kunder_id_fk" FOREIGN KEY ("kund_id") REFERENCES "public"."kunder"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recensioner" ADD CONSTRAINT "recensioner_bokning_id_bokningar_id_fk" FOREIGN KEY ("bokning_id") REFERENCES "public"."bokningar"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunchtider" ADD CONSTRAINT "lunchtider_foretagsslug_foretag_slug_fk" FOREIGN KEY ("foretagsslug") REFERENCES "public"."foretag"("slug") ON DELETE cascade ON UPDATE no action;