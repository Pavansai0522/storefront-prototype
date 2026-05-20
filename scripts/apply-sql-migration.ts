/**
 * Apply a SQL migration file to the linked Supabase Postgres database.
 *
 * Requires in root `.env` (pick one):
 *   - DATABASE_URL or SUPABASE_DB_URL (full connection string), or
 *   - SUPABASE_DB_PASSWORD (database password from Dashboard → Database)
 *
 * Usage:
 *   npx tsx scripts/apply-sql-migration.ts supabase/migrations/20260520100000_product_deal_featured_group.sql
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error('Usage: npx tsx scripts/apply-sql-migration.ts <path-to.sql>');
  process.exit(1);
}

const sqlPath = path.resolve(migrationPath);
if (!fs.existsSync(sqlPath)) {
  console.error(`Migration file not found: ${sqlPath}`);
  process.exit(1);
}

function buildConnectionString(): string {
  const direct = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (direct) {
    return direct;
  }

  const password = process.env.SUPABASE_DB_PASSWORD;
  const baseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const ref = baseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!password || !ref) {
    console.error(
      'Missing database credentials. Add to root .env:\n' +
        '  SUPABASE_DB_PASSWORD=<from Supabase Dashboard → Project Settings → Database>\n' +
        'or\n' +
        '  DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres',
    );
    process.exit(1);
  }

  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

async function main(): Promise<void> {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const connectionString = buildConnectionString();
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

  await client.connect();
  try {
    await client.query(sql);
    console.log(`Applied migration: ${path.basename(sqlPath)}`);
  } finally {
    await client.end();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
