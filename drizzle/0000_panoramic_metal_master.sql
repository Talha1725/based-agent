CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"email" varchar(255),
	"hashed_password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"github_username" varchar(255),
	"github_url" varchar(255),
	"wallet_address" varchar(255) NOT NULL,
	"image_url" varchar(255)
);
