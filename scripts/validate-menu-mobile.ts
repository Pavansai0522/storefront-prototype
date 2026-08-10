/**
 * Mobile viewport smoke test for restaurant menu section pagination.
 * Run: npm run validate:menu-mobile
 * Requires: dev server at http://localhost:3003 (npm run dev:restaurant)
 */
import { chromium, devices, type Page } from 'playwright';

const MENU_URL = 'http://localhost:3003/menu';
const MIN_TOUCH_TARGET_PX = 44;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForMenuReady(page: Page): Promise<void> {
  await page.goto(MENU_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.getByRole('heading', { name: 'Food Menu' }).waitFor({ timeout: 15_000 });
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  assert(!overflow, 'page should not scroll horizontally on mobile');
}

async function assertTouchTarget(page: Page, name: string | RegExp): Promise<void> {
  const button = page.getByRole('button', { name });
  const box = await button.boundingBox();
  assert(box !== null, `missing button: ${String(name)}`);
  assert(
    box.height >= MIN_TOUCH_TARGET_PX && box.width >= MIN_TOUCH_TARGET_PX,
    `${String(name)} touch target ${box.width}x${box.height} is below ${MIN_TOUCH_TARGET_PX}px`,
  );
}

async function main(): Promise<void> {
  const consoleErrors: string[] = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
  });
  const page = await context.newPage();

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  console.log('Mobile checks (iPhone 13 viewport)...');
  await waitForMenuReady(page);
  await assertNoHorizontalOverflow(page);

  await page.getByText(/Starters & Appetizers · Page 1 of 2/).waitFor();
  const startersPageOneCount = await page.locator('article').count();
  assert(startersPageOneCount === 8, `Starters page 1 should show 8 dishes, saw ${startersPageOneCount}`);

  const startersPagination = page.getByRole('navigation', { name: 'Starters & Appetizers pages' });
  await startersPagination.waitFor();
  await assertTouchTarget(page, 'Previous menu page');
  await assertTouchTarget(page, 'Next menu page');
  await assertTouchTarget(page, 'Menu page 1');
  await assertTouchTarget(page, 'Menu page 2');

  await page.getByRole('button', { name: 'Menu page 2' }).click();
  await page.getByText(/Starters & Appetizers · Page 2 of 2 · Dishes 9–10 of 10/).waitFor();
  const startersPageTwoCount = await page.locator('article').count();
  assert(startersPageTwoCount === 2, `Starters page 2 should show 2 dishes, saw ${startersPageTwoCount}`);

  await page.getByRole('button', { name: 'Curries & Gravies' }).click();
  await page.getByText(/Curries & Gravies · Page 1 of 2/).waitFor();
  const curriesPageOneCount = await page.locator('article').count();
  assert(curriesPageOneCount === 8, `Curries page 1 should show 8 dishes, saw ${curriesPageOneCount}`);

  await page.getByRole('button', { name: 'Starters & Appetizers' }).click();
  await page.getByText(/Starters & Appetizers · Page 2 of 2/).waitFor();
  console.log('  OK per-section pagination remembers page state on mobile');

  await page.getByRole('button', { name: 'Biryani & Rice' }).click();
  await page.getByText(/Biryani & Rice · 1 dish/).waitFor();
  const biryaniPagination = page.getByRole('navigation', { name: 'Biryani & Rice pages' });
  assert(
    (await biryaniPagination.count()) === 0,
    'single-dish sections should not render pagination controls',
  );
  console.log('  OK small sections hide pagination on mobile');

  const sectionNav = page.getByRole('navigation', { name: 'Menu sections' });
  await sectionNav.waitFor();
  const sectionNavBox = await sectionNav.boundingBox();
  assert(sectionNavBox !== null, 'section navigation should be visible');
  assert(sectionNavBox.width <= 390 + 1, 'section nav should fit mobile viewport width');

  const benignConsoleErrors = consoleErrors.filter(
    (line) =>
      !line.includes('favicon') &&
      !line.includes('404') &&
      !line.includes('ReactDOM.render is no longer supported'),
  );
  assert(
    benignConsoleErrors.length === 0,
    `unexpected console errors on mobile: ${benignConsoleErrors.join(' | ')}`,
  );

  await browser.close();
  console.log('All mobile menu pagination checks passed.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
