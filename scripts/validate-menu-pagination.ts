/**
 * Validates per-section menu pagination logic and live restaurant catalog counts.
 * Run: npm run validate:menu-pagination
 */
import './load-env';
import { restaurantCatalogItems } from './seed-data/restaurant-catalog';
import {
  getSectionPageCount,
  sliceSectionPage,
} from '../restaurant-v1/src/utils/menuSectionPagination';
import { MENU_SECTION_PAGE_SIZE } from '../restaurant-v1/src/constants/menu';

const RESTAURANT_CLIENT_ID = 'client-restaurant-1';

type CatalogRow = {
  name: string;
  category: string;
};

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function runUnitChecks(): void {
  console.log('Unit checks (menuSectionPagination)...');

  assert(getSectionPageCount(0, MENU_SECTION_PAGE_SIZE) === 1, 'empty section should still report 1 page');
  assert(getSectionPageCount(2, MENU_SECTION_PAGE_SIZE) === 1, '2 items should be 1 page');
  assert(getSectionPageCount(8, MENU_SECTION_PAGE_SIZE) === 1, '8 items should be 1 page');
  assert(getSectionPageCount(9, MENU_SECTION_PAGE_SIZE) === 2, '9 items should be 2 pages');

  const smallSection = sliceSectionPage(['a', 'b'], 1, MENU_SECTION_PAGE_SIZE);
  assert(!smallSection.showsPagination, 'small sections should hide pagination');
  assert(smallSection.items.length === 2, 'small section should show all items');

  const nineItems = Array.from({ length: 9 }, (_, index) => `item-${index + 1}`);
  const pageOne = sliceSectionPage(nineItems, 1, MENU_SECTION_PAGE_SIZE);
  const pageTwo = sliceSectionPage(nineItems, 2, MENU_SECTION_PAGE_SIZE);

  assert(pageOne.showsPagination, '9-item section page 1 should show pagination');
  assert(pageOne.items.length === 8, 'page 1 should contain 8 dishes');
  assert(pageTwo.items.length === 1, 'page 2 should contain remaining dish');
  assert(pageTwo.page === 2, 'page 2 index should be 2');

  console.log('  OK pagination boundaries at 8/9 items');
}

function summarizeSeedCatalog(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of restaurantCatalogItems()) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return counts;
}

async function runLiveCatalogCheck(): Promise<void> {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Skipping live Supabase check: missing URL or anon key in .env');
    return;
  }

  console.log('\nLive catalog check (Supabase)...');

  const endpoint =
    `${url}/rest/v1/products?client_id=eq.${RESTAURANT_CLIENT_ID}` +
    '&select=name,category&order=sort_order';
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = (await res.json()) as unknown;

  if (!res.ok || !Array.isArray(rows)) {
    throw new Error(`Supabase fetch failed: HTTP ${res.status}`);
  }

  const byCategory = new Map<string, number>();
  for (const row of rows as CatalogRow[]) {
    byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1);
  }

  let paginatedSections = 0;
  let singlePageSections = 0;

  for (const [category, count] of byCategory.entries()) {
    const totalPages = getSectionPageCount(count, MENU_SECTION_PAGE_SIZE);
    const label = `${category}: ${count} dishes → ${totalPages} page${totalPages === 1 ? '' : 's'}`;
    if (totalPages > 1) {
      paginatedSections += 1;
      console.log(`  PAGINATED ${label}`);
    } else {
      singlePageSections += 1;
      console.log(`  single-page ${label}`);
    }
  }

  assert(rows.length > 0, 'restaurant catalog should not be empty');
  assert(
    paginatedSections >= 2,
    `expected at least 2 paginated sections in live data, found ${paginatedSections}. Re-run: SEED_FORCE=true npm run seed:restaurant`,
  );

  console.log(
    `  OK ${rows.length} dishes across ${byCategory.size} sections (${paginatedSections} paginated, ${singlePageSections} single-page)`,
  );
}

async function main(): Promise<void> {
  runUnitChecks();

  console.log('\nSeed catalog preview...');
  const seedCounts = summarizeSeedCatalog();
  for (const [category, count] of seedCounts.entries()) {
    const totalPages = getSectionPageCount(count, MENU_SECTION_PAGE_SIZE);
    console.log(`  ${category}: ${count} dishes → ${totalPages} page${totalPages === 1 ? '' : 's'}`);
  }

  const paginatedSeedSections = [...seedCounts.values()].filter(
    (count) => getSectionPageCount(count, MENU_SECTION_PAGE_SIZE) > 1,
  ).length;
  assert(
    paginatedSeedSections >= 2,
    'seed catalog should include at least 2 sections with 9+ dishes each',
  );
  console.log(`  OK seed includes ${paginatedSeedSections} paginated sections`);

  await runLiveCatalogCheck();
  console.log('\nAll menu pagination checks passed.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
