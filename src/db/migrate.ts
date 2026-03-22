import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './index.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, '../../drizzle');

export function runMigrations(): void {
  migrate(db, { migrationsFolder });
}
