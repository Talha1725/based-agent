ALTER TABLE "users" ADD COLUMN "rank" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referrals_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "join_position" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "n_ref" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "n_join" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weighted_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "points" integer DEFAULT 0;