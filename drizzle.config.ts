import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: [".env.local", ".env"],
  override: true,
});

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
