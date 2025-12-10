CREATE TABLE "kunder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"namn" varchar(255) NOT NULL,
	"telefon" varchar(20),
	"foretagsslug" text,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_datum" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kunder_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "oppettider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"foretagsslug" text NOT NULL,
	"veckodag" text NOT NULL,
	"oppnar" time,
	"stanger" time,
	"stangt" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bokningar" DROP CONSTRAINT "bokningar_kund_id_anvandare_id_fk";
--> statement-breakpoint
ALTER TABLE "oppettider" ADD CONSTRAINT "oppettider_foretagsslug_foretag_slug_fk" FOREIGN KEY ("foretagsslug") REFERENCES "public"."foretag"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bokningar" ADD CONSTRAINT "bokningar_kund_id_kunder_id_fk" FOREIGN KEY ("kund_id") REFERENCES "public"."kunder"("id") ON DELETE no action ON UPDATE no action;