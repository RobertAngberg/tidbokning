CREATE TABLE "anvandare" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"namn" text NOT NULL,
	"telefon" text,
	"roll" text DEFAULT 'kund' NOT NULL,
	"foretagsslug" text,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_datum" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anvandare_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bokningar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kund_id" uuid NOT NULL,
	"personal_id" uuid,
	"tjanst_id" uuid NOT NULL,
	"utforare_id" uuid,
	"start_tid" timestamp NOT NULL,
	"slut_tid" timestamp NOT NULL,
	"status" text DEFAULT 'Väntande' NOT NULL,
	"anteckningar" text,
	"foretagsslug" text NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tjanster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"namn" text NOT NULL,
	"beskrivning" text,
	"varaktighet" integer NOT NULL,
	"pris" integer NOT NULL,
	"foretagsslug" text NOT NULL,
	"kategori" text,
	"aktiv" integer DEFAULT 1 NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utforare" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"namn" text NOT NULL,
	"email" text,
	"telefon" text,
	"beskrivning" text,
	"bild_url" text,
	"aktiv" boolean DEFAULT true NOT NULL,
	"foretagsslug" text NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utforare_tjanster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utforare_id" uuid NOT NULL,
	"tjanst_id" uuid NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foretag" (
	"id" text PRIMARY KEY NOT NULL,
	"namn" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"beskrivning" text,
	"adress" varchar(255),
	"postnummer" varchar(10),
	"stad" varchar(100),
	"telefon" varchar(20),
	"email" varchar(255),
	"webbplats" varchar(255),
	"logo_url" varchar(500),
	"oppettider" jsonb,
	"aktiv" boolean DEFAULT true NOT NULL,
	"skapad_vid" timestamp DEFAULT now() NOT NULL,
	"uppdaterad_vid" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "foretag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "foretag_bilder" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"foretagsslug" varchar(255) NOT NULL,
	"bild_url" text NOT NULL,
	"beskrivning" text,
	"sorteringsordning" integer DEFAULT 0 NOT NULL,
	"skapad_datum" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"roll" text DEFAULT 'kund' NOT NULL,
	"foretagsslug" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bokningar" ADD CONSTRAINT "bokningar_kund_id_anvandare_id_fk" FOREIGN KEY ("kund_id") REFERENCES "public"."anvandare"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bokningar" ADD CONSTRAINT "bokningar_personal_id_anvandare_id_fk" FOREIGN KEY ("personal_id") REFERENCES "public"."anvandare"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bokningar" ADD CONSTRAINT "bokningar_tjanst_id_tjanster_id_fk" FOREIGN KEY ("tjanst_id") REFERENCES "public"."tjanster"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bokningar" ADD CONSTRAINT "bokningar_utforare_id_utforare_id_fk" FOREIGN KEY ("utforare_id") REFERENCES "public"."utforare"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utforare" ADD CONSTRAINT "utforare_foretagsslug_foretag_slug_fk" FOREIGN KEY ("foretagsslug") REFERENCES "public"."foretag"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utforare_tjanster" ADD CONSTRAINT "utforare_tjanster_utforare_id_utforare_id_fk" FOREIGN KEY ("utforare_id") REFERENCES "public"."utforare"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utforare_tjanster" ADD CONSTRAINT "utforare_tjanster_tjanst_id_tjanster_id_fk" FOREIGN KEY ("tjanst_id") REFERENCES "public"."tjanster"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foretag_bilder" ADD CONSTRAINT "foretag_bilder_foretagsslug_foretag_slug_fk" FOREIGN KEY ("foretagsslug") REFERENCES "public"."foretag"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;