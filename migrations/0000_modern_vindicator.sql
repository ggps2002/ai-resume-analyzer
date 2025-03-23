CREATE TABLE "contact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"linkedin" text,
	"github" text,
	"location" text,
	"X" text,
	CONSTRAINT "contact_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"institution" text,
	"university" text,
	"degree" text NOT NULL,
	"field" text,
	"cgpa" text,
	"percentage" text,
	"duration" text NOT NULL,
	CONSTRAINT "education_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"duration" text NOT NULL,
	"location" text NOT NULL,
	"responsibilities" jsonb NOT NULL,
	CONSTRAINT "experience_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255),
	"skills" jsonb,
	"queryString" text,
	CONSTRAINT "profile_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"name" text NOT NULL,
	"duration" text NOT NULL,
	"description" jsonb NOT NULL,
	"tech_stack" jsonb NOT NULL,
	CONSTRAINT "projects_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_full_name_unique" UNIQUE("full_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;