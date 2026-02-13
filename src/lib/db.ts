import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. DB features will fail until configured.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
