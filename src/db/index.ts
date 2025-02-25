import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema,
});
