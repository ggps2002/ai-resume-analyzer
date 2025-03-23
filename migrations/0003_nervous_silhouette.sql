CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"posted" text NOT NULL,
	"valid" text NOT NULL,
	"link" text NOT NULL,
	CONSTRAINT "jobs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;