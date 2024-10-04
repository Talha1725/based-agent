DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('waiting_list', 'main_net', 'suspended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_status" "user_status" DEFAULT 'waiting_list' NOT NULL;