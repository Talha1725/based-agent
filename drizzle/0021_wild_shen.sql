CREATE TABLE IF NOT EXISTS "user_code" (
	"email" varchar(255) NOT NULL,
	"wallet_address" varchar(255) NOT NULL,
	"code" integer
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" DROP NOT NULL;