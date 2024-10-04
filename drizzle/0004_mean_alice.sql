ALTER TABLE "agents" RENAME COLUMN "contributor_pool_allocation" TO "contributor_pool_percentage";--> statement-breakpoint
ALTER TABLE "agents" RENAME COLUMN "coin_amount" TO "initial_buy_amount";--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "meta_data" jsonb;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "v_eth" integer;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "v_token" integer;