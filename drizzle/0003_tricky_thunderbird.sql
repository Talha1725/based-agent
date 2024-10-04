ALTER TABLE "agents" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "skills" text[];--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "telegram" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "twitter" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "github" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "token_name" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "token_symbol" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "contributor_pool_allocation" integer;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "coin_currency" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "coin_amount" integer;