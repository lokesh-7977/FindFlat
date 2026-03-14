CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."equipment_category" AS ENUM('furniture', 'electronics', 'appliances', 'kitchen', 'fitness', 'books', 'other');--> statement-breakpoint
CREATE TYPE "public"."equipment_condition" AS ENUM('new', 'like-new', 'good', 'fair', 'poor');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('sports', 'music', 'meetup', 'workshop', 'party', 'cultural', 'tech', 'networking', 'community', 'other');--> statement-breakpoint
CREATE TYPE "public"."food_pref" AS ENUM('veg', 'non-veg', 'vegan', 'no-preference');--> statement-breakpoint
CREATE TYPE "public"."smoking" AS ENUM('yes', 'no', 'occasionally');--> statement-breakpoint
CREATE TYPE "public"."flat_type" AS ENUM('1bhk', '2bhk', '3bhk', '4bhk', 'studio', 'shared', 'penthouse');--> statement-breakpoint
CREATE TYPE "public"."furnishing" AS ENUM('furnished', 'semi-furnished', 'unfurnished');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('maid', 'cook', 'cleaner', 'laundry', 'babysitter', 'electrician', 'plumber', 'carpenter', 'painter', 'pest-control', 'movers', 'other');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" varchar(500),
	"ip_address" varchar(45),
	CONSTRAINT "sessions_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"google_sub" varchar(255) NOT NULL,
	"city" varchar(255),
	"photo" varchar(500),
	"gender" "gender",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_sub_unique" UNIQUE("google_sub")
);
--> statement-breakpoint
CREATE TABLE "equipment_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"city" varchar(255) NOT NULL,
	"locality" varchar(255),
	"price" integer NOT NULL,
	"category" "equipment_category" NOT NULL,
	"condition" "equipment_condition" NOT NULL,
	"photos" text,
	"seller_contact" varchar(20),
	"posted_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"city" varchar(255) NOT NULL,
	"locality" varchar(255),
	"venue" varchar(500),
	"event_category" "event_category" NOT NULL,
	"event_date" timestamp NOT NULL,
	"entry_fee" integer,
	"max_attendees" integer,
	"organizer" varchar(255),
	"event_link" varchar(500),
	"posted_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flatmate_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"city" varchar(255) NOT NULL,
	"locality" varchar(255),
	"budget" integer NOT NULL,
	"description" text,
	"gender" varchar(50),
	"age" integer,
	"occupation" varchar(255),
	"smoking" "smoking",
	"food_pref" "food_pref",
	"contact_phone" varchar(20),
	"move_in_date" timestamp,
	"posted_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "flatmate_profiles_posted_by_unique" UNIQUE("posted_by")
);
--> statement-breakpoint
CREATE TABLE "flat_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"city" varchar(255) NOT NULL,
	"locality" varchar(255),
	"address" text,
	"rent" integer NOT NULL,
	"deposit" integer,
	"flat_type" "flat_type" NOT NULL,
	"furnishing" "furnishing" NOT NULL,
	"preferred_gender" varchar(50),
	"amenities" text,
	"photos" text,
	"contact_phone" varchar(20),
	"available_from" timestamp,
	"posted_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"city" varchar(255) NOT NULL,
	"locality" varchar(255),
	"service_type" "service_type" NOT NULL,
	"contact_name" varchar(255),
	"contact_phone" varchar(20),
	"experience" varchar(100),
	"available_time" varchar(255),
	"monthly_charge" integer,
	"rating" text,
	"posted_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_listings" ADD CONSTRAINT "equipment_listings_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flatmate_profiles" ADD CONSTRAINT "flatmate_profiles_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flat_listings" ADD CONSTRAINT "flat_listings_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_services" ADD CONSTRAINT "local_services_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_google_sub_idx" ON "users" USING btree ("google_sub");--> statement-breakpoint
CREATE INDEX "equipment_listings_city_idx" ON "equipment_listings" USING btree ("city");--> statement-breakpoint
CREATE INDEX "equipment_listings_category_idx" ON "equipment_listings" USING btree ("category");--> statement-breakpoint
CREATE INDEX "equipment_listings_price_idx" ON "equipment_listings" USING btree ("price");--> statement-breakpoint
CREATE INDEX "equipment_listings_posted_by_idx" ON "equipment_listings" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "events_city_idx" ON "events" USING btree ("city");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("event_category");--> statement-breakpoint
CREATE INDEX "events_date_idx" ON "events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "events_posted_by_idx" ON "events" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "flatmate_profiles_city_idx" ON "flatmate_profiles" USING btree ("city");--> statement-breakpoint
CREATE INDEX "flatmate_profiles_budget_idx" ON "flatmate_profiles" USING btree ("budget");--> statement-breakpoint
CREATE INDEX "flat_listings_city_idx" ON "flat_listings" USING btree ("city");--> statement-breakpoint
CREATE INDEX "flat_listings_posted_by_idx" ON "flat_listings" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "flat_listings_rent_idx" ON "flat_listings" USING btree ("rent");--> statement-breakpoint
CREATE INDEX "local_services_city_idx" ON "local_services" USING btree ("city");--> statement-breakpoint
CREATE INDEX "local_services_type_idx" ON "local_services" USING btree ("service_type");--> statement-breakpoint
CREATE INDEX "local_services_posted_by_idx" ON "local_services" USING btree ("posted_by");