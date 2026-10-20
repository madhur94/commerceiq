import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const SCREENSHOT_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots');
const M02_SCREENSHOT_DIR = path.resolve(SCREENSHOT_DIR, 'm02');
const ARTIFACT_M02_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m02';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(M02_SCREENSHOT_DIR)) {
  fs.mkdirSync(M02_SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_M02_DIR)) {
  try {
    fs.mkdirSync(ARTIFACT_M02_DIR, { recursive: true });
  } catch {
    // Artifact dir fallback
  }
}

// Simple static server for dist
function startServer(port: number): Promise<http.Server> {
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url || '/';
    if (reqPath.includes('?')) reqPath = reqPath.split('?')[0];

    let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading ' + reqPath);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Preview server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4173;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for automated multi-viewport capture...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const corePages = [
    { route: '/', name: '01_desktop_overview', viewport: { width: 1440, height: 900 } },
    { route: '/sales-intelligence', name: '03_desktop_sales_intelligence', viewport: { width: 1440, height: 900 } },
    { route: '/customer-intelligence', name: '04_desktop_customer_intelligence', viewport: { width: 1440, height: 900 } },
    { route: '/data-explorer', name: '05_desktop_data_explorer', viewport: { width: 1440, height: 900 } },
    { route: '/ml-insights', name: '06_desktop_ml_insights', viewport: { width: 1440, height: 900 } },
    { route: '/data-pipeline', name: '07_desktop_data_pipeline', viewport: { width: 1440, height: 900 } },
    { route: '/unknown-route-test', name: '08_desktop_404_not_found', viewport: { width: 1440, height: 900 } },
    { route: '/', name: '09_tablet_overview', viewport: { width: 768, height: 1024 } },
    { route: '/', name: '10_mobile_overview', viewport: { width: 390, height: 844 } },
  ];

  for (const item of corePages) {
    const page = await context.newPage();
    await page.setViewportSize(item.viewport);
    console.log(`Navigating to ${item.route} at ${item.viewport.width}x${item.viewport.height}...`);
    await page.goto(`${BASE_URL}${item.route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    const outPath = path.join(SCREENSHOT_DIR, `${item.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  ✓ Saved ${item.name}.png`);
    await page.close();
  }

  // Collapsed sidebar on desktop
  console.log('Capturing collapsed sidebar on desktop...');
  const collapsePage = await context.newPage();
  await collapsePage.setViewportSize({ width: 1440, height: 900 });
  await collapsePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await collapsePage.waitForTimeout(600);
  const collapseBtn = collapsePage.locator('button[aria-label="Collapse sidebar"]');
  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await collapsePage.waitForTimeout(400);
  }
  await collapsePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_overview_collapsed_sidebar.png') });
  console.log('  ✓ Saved 02_desktop_overview_collapsed_sidebar.png');
  await collapsePage.close();

  // Mobile drawer open
  console.log('Capturing mobile drawer open...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  const menuBtn = mobilePage.locator('button[aria-label="Open navigation menu"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(400);
  }
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_drawer_open.png') });
  console.log('  ✓ Saved 11_mobile_drawer_open.png');
  await mobilePage.close();

  // -------------------------------------------------------------
  // M02 DEDICATED SALES INTELLIGENCE & CONNECTED EXPLORATION TESTS
  // -------------------------------------------------------------
  console.log('\n--- Capturing M02 Sales Intelligence Specific Viewports & Interactions ---');

  const m02Views = [
    { route: '/sales-intelligence', name: 'm02_01_sales_intelligence_1440', viewport: { width: 1440, height: 900 } },
    { route: '/sales-intelligence', name: 'm02_02_sales_intelligence_1280', viewport: { width: 1280, height: 800 } },
    { route: '/sales-intelligence', name: 'm02_03_sales_intelligence_tablet', viewport: { width: 768, height: 1024 } },
    { route: '/sales-intelligence', name: 'm02_04_sales_intelligence_mobile', viewport: { width: 390, height: 844 } },
  ];

  for (const item of m02Views) {
    const page = await context.newPage();
    await page.setViewportSize(item.viewport);
    console.log(`Capturing M02 ${item.name} at ${item.viewport.width}x${item.viewport.height}...`);
    await page.goto(`${BASE_URL}${item.route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    const outPath = path.join(M02_SCREENSHOT_DIR, `${item.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });

    if (fs.existsSync(ARTIFACT_M02_DIR)) {
      try {
        fs.copyFileSync(outPath, path.join(ARTIFACT_M02_DIR, `${item.name}.png`));
      } catch {
        // Artifact fallback
      }
    }
    console.log(`  ✓ Saved ${item.name}.png`);
    await page.close();
  }

  // M02-05: Sales Intelligence with 32-day table expanded
  console.log('Capturing M02-05: Sales Intelligence daily breakdown table expanded...');
  const tablePage = await context.newPage();
  await tablePage.setViewportSize({ width: 1440, height: 900 });
  await tablePage.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
  await tablePage.waitForTimeout(1000);
  const toggleBtn = tablePage.locator('button:has-text("Show Complete 32-Day Table Breakdown")');
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await tablePage.waitForTimeout(400);
  }
  const tableOutPath = path.join(M02_SCREENSHOT_DIR, 'm02_05_sales_intelligence_table_expanded.png');
  await tablePage.screenshot({ path: tableOutPath, fullPage: false });
  if (fs.existsSync(ARTIFACT_M02_DIR)) {
    try {
      fs.copyFileSync(tableOutPath, path.join(ARTIFACT_M02_DIR, 'm02_05_sales_intelligence_table_expanded.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02_05_sales_intelligence_table_expanded.png');
  await tablePage.close();

  // M02-06: Deep-Linked Data Explorer by Brand (Apple)
  console.log('Capturing M02-06: Deep-linked Data Explorer (?brand=apple)...');
  const brandDrillPage = await context.newPage();
  await brandDrillPage.setViewportSize({ width: 1440, height: 900 });
  await brandDrillPage.goto(`${BASE_URL}/data-explorer?brand=apple`, { waitUntil: 'networkidle' });
  await brandDrillPage.waitForTimeout(1000);
  const brandOutPath = path.join(M02_SCREENSHOT_DIR, 'm02_06_data_explorer_deep_linked_brand.png');
  await brandDrillPage.screenshot({ path: brandOutPath, fullPage: false });
  if (fs.existsSync(ARTIFACT_M02_DIR)) {
    try {
      fs.copyFileSync(brandOutPath, path.join(ARTIFACT_M02_DIR, 'm02_06_data_explorer_deep_linked_brand.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02_06_data_explorer_deep_linked_brand.png');
  await brandDrillPage.close();

  // M02-07: Deep-Linked Data Explorer by Category (Electronics)
  console.log('Capturing M02-07: Deep-linked Data Explorer (?tab=categories&category=electronics)...');
  const catDrillPage = await context.newPage();
  await catDrillPage.setViewportSize({ width: 1440, height: 900 });
  await catDrillPage.goto(`${BASE_URL}/data-explorer?tab=categories&category=electronics`, { waitUntil: 'networkidle' });
  await catDrillPage.waitForTimeout(1000);
  const catOutPath = path.join(M02_SCREENSHOT_DIR, 'm02_07_data_explorer_deep_linked_category.png');
  await catDrillPage.screenshot({ path: catOutPath, fullPage: false });
  if (fs.existsSync(ARTIFACT_M02_DIR)) {
    try {
      fs.copyFileSync(catOutPath, path.join(ARTIFACT_M02_DIR, 'm02_07_data_explorer_deep_linked_category.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02_07_data_explorer_deep_linked_category.png');
  await catDrillPage.close();

  await browser.close();
  server.close();
  console.log('\n✓ All visual screenshots captured successfully in docs/commerceiq/screenshots/ and m02/');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
