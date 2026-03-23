import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/db/auth-schema.ts', './src/db/todo-schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@127.0.0.1:5432/titvo',
  },
});
