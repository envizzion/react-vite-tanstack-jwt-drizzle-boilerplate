import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:${parseInt(process.env.DB_PORT)}/${process.env.DB_NAME}`,
  },
});