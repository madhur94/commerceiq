import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M02V_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m02v-current');
const ARTIFACT_M02V_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m02v-current';

[DOCS_M02V_DIR, ARTIFACT_M02V_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function startServer(port: number): Promise<http.Server> {
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
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
      console.log(`M02-V Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4174;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for M02-V comprehensive visual capture...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const captures = [
    // 1. Overview across 4 responsive viewports
    { route: '/', name: 'm02v_01_desktop_overview_1440', viewport: { width: 1440, height: 900 }, wait: 1800 },
    { route: '/', name: 'm02v_02_desktop_overview_1280', viewport: { width: 1280, height: 800 }, wait: 1800 },
    { route: '/', name: 'm02v_03_tablet_overview_768', viewport: { width: 768, height: 1024 }, wait: 1800 },
    { route: '/', name: 'm02v_04_mobile_overview_390', viewport: { width: 390, height: 844 }, wait: 1800 },

    // 2. Sales Intelligence across 4 viewports
    { route: '/sales-intelligence', name: 'm02v_07_sales_intelligence_1440', viewport: { width: 1440, height: 900 }, wait: 1800 },
    { route: '/sales-intelligence', name: 'm02v_08_sales_intelligence_1280', viewport: { width: 1280, height: 800 }, wait: 1800 },
    { route: '/sales-intelligence', name: 'm02v_09_sales_intelligence_tablet_768', viewport: { width: 768, height: 1024 }, wait: 1800 },
    { route: '/sales-intelligence', name: 'm02v_10_sales_intelligence_mobile_390', viewport: { width: 390, height: 844 }, wait: 1800 },

    // 3. Customer Intelligence, ML Insights, Data Pipeline, Data Explorer
    { route: '/customer-intelligence', name: 'm02v_14_customer_intelligence_1440', viewport: { width: 1440, height: 900 }, wait: 1600 },
    { route: '/ml-insights', name: 'm02v_15_ml_insights_1440', viewport: { width: 1440, height: 900 }, wait: 1600 },
    { route: '/data-pipeline', name: 'm02v_16_data_pipeline_1440', viewport: { width: 1440, height: 900 }, wait: 1600 },
    { route: '/unknown-route-test', name: 'm02v_17_404_not_found_1440', viewport: { width: 1440, height: 900 }, wait: 800 },
  ];

  for (const item of captures) {
    const page = await context.newPage();
    await page.setViewportSize(item.viewport);
    console.log(`Capturing ${item.name} at ${item.viewport.width}x${item.viewport.height}...`);
    await page.goto(`${BASE_URL}${item.route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(item.wait);

    const docPath = path.join(DOCS_M02V_DIR, `${item.name}.png`);
    await page.screenshot({ path: docPath, fullPage: false });

    if (fs.existsSync(ARTIFACT_M02V_DIR)) {
      try {
        fs.copyFileSync(docPath, path.join(ARTIFACT_M02V_DIR, `${item.name}.png`));
      } catch {}
    }
    console.log(`  ✓ Saved ${item.name}.png`);
    await page.close();
  }

  // 4. Desktop Sidebar Collapsed State
  console.log('Capturing m02v_05_desktop_overview_collapsed_sidebar...');
  const collapsePage = await context.newPage();
  await collapsePage.setViewportSize({ width: 1440, height: 900 });
  await collapsePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await collapsePage.waitForTimeout(1000);
  const collapseBtn = collapsePage.locator('button[aria-label="Collapse sidebar"]');
  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await collapsePage.waitForTimeout(500);
  }
  const colPath = path.join(DOCS_M02V_DIR, 'm02v_05_desktop_overview_collapsed_sidebar.png');
  await collapsePage.screenshot({ path: colPath });
  if (fs.existsSync(ARTIFACT_M02V_DIR)) {
    try {
      fs.copyFileSync(colPath, path.join(ARTIFACT_M02V_DIR, 'm02v_05_desktop_overview_collapsed_sidebar.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02v_05_desktop_overview_collapsed_sidebar.png');
  await collapsePage.close();

  // 5. Mobile Drawer Open
  console.log('Capturing m02v_06_mobile_drawer_open...');
  const drawerPage = await context.newPage();
  await drawerPage.setViewportSize({ width: 390, height: 844 });
  await drawerPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await drawerPage.waitForTimeout(1000);
  const menuBtn = drawerPage.locator('button[aria-label="Open navigation menu"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await drawerPage.waitForTimeout(500);
  }
  const drawerPath = path.join(DOCS_M02V_DIR, 'm02v_06_mobile_drawer_open.png');
  await drawerPage.screenshot({ path: drawerPath });
  if (fs.existsSync(ARTIFACT_M02V_DIR)) {
    try {
      fs.copyFileSync(drawerPath, path.join(ARTIFACT_M02V_DIR, 'm02v_06_mobile_drawer_open.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02v_06_mobile_drawer_open.png');
  await drawerPage.close();

  // 6. Sales Intelligence 32-day table expanded
  console.log('Capturing m02v_11_sales_intelligence_table_expanded...');
  const tablePage = await context.newPage();
  await tablePage.setViewportSize({ width: 1440, height: 900 });
  await tablePage.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
  await tablePage.waitForTimeout(1400);
  const toggleBtn = tablePage.locator('button:has-text("Show Complete 32-Day Table Breakdown")');
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await tablePage.waitForTimeout(600);
  }
  const tablePath = path.join(DOCS_M02V_DIR, 'm02v_11_sales_intelligence_table_expanded.png');
  await tablePage.screenshot({ path: tablePath });
  if (fs.existsSync(ARTIFACT_M02V_DIR)) {
    try {
      fs.copyFileSync(tablePath, path.join(ARTIFACT_M02V_DIR, 'm02v_11_sales_intelligence_table_expanded.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02v_11_sales_intelligence_table_expanded.png');
  await tablePage.close();

  // 7. Data Explorer with active filter: Brand (apple)
  console.log('Capturing m02v_12_data_explorer_active_filter_brand...');
  const brandPage = await context.newPage();
  await brandPage.setViewportSize({ width: 1440, height: 900 });
  await brandPage.goto(`${BASE_URL}/data-explorer?brand=apple`, { waitUntil: 'networkidle' });
  await brandPage.waitForTimeout(1400);
  const brandPath = path.join(DOCS_M02V_DIR, 'm02v_12_data_explorer_active_filter_brand.png');
  await brandPage.screenshot({ path: brandPath });
  if (fs.existsSync(ARTIFACT_M02V_DIR)) {
    try {
      fs.copyFileSync(brandPath, path.join(ARTIFACT_M02V_DIR, 'm02v_12_data_explorer_active_filter_brand.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02v_12_data_explorer_active_filter_brand.png');
  await brandPage.close();

  // 8. Data Explorer with active filter: Category (electronics)
  console.log('Capturing m02v_13_data_explorer_active_filter_category...');
  const catPage = await context.newPage();
  await catPage.setViewportSize({ width: 1440, height: 900 });
  await catPage.goto(`${BASE_URL}/data-explorer?tab=categories&category=electronics`, { waitUntil: 'networkidle' });
  await catPage.waitForTimeout(1400);
  const catPath = path.join(DOCS_M02V_DIR, 'm02v_13_data_explorer_active_filter_category.png');
  await catPage.screenshot({ path: catPath });
  if (fs.existsSync(ARTIFACT_M02V_DIR)) {
    try {
      fs.copyFileSync(catPath, path.join(ARTIFACT_M02V_DIR, 'm02v_13_data_explorer_active_filter_category.png'));
    } catch {}
  }
  console.log('  ✓ Saved m02v_13_data_explorer_active_filter_category.png');
  await catPage.close();

  await browser.close();
  server.close();
  console.log('\n✓ Successfully captured all 17 M02-V screenshots into docs/commerceiq/screenshots/m02v-current/ and brain artifact directory!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
