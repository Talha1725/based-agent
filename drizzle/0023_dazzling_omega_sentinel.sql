ALTER TABLE "preferences" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "user_code" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "user_code" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_code" DROP COLUMN IF EXISTS "wallet_address";--> statement-breakpoint
ALTER TABLE "user_code" DROP COLUMN IF EXISTS "isVerified";