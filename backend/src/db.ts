import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgres://postgres:postgres@127.0.0.1:5432/titvo';

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);
