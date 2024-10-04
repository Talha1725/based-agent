import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

async function main() {
  const connectionString = process.env.DATABASE_URL as string;
  console.log(connectionString);
  const migrationsClient = postgres(connectionString, {
    max: 1,
  });
  const db = drizzle(migrationsClient, { schema });
  
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete!");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  } finally {
    await migrationsClient.end();
  }
}

main();
