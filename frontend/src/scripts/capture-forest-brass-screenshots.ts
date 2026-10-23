import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_THEME_DIR = path.resolve(__dirname, '../../../docs/commerceiq/theme-forest-brass/screenshots');
const ARTIFACT_THEME_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\theme-forest-brass';

[DOCS_THEME_DIR, ARTIFACT_THEME_DIR].forEach((dir) => {
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
      console.log(`Theme Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4173;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle'],
    });
  } catch {
    browser = await chromium.launch({
      headless: true,
      args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle'],
    });
  }

  async function saveScreenshot(page: any, filename: string) {
    const docsPath = path.join(DOCS_THEME_DIR, filename);
    const artifactPath = path.join(ARTIFACT_THEME_DIR, filename);
    await page.screenshot({ path: docsPath, fullPage: false });
    fs.copyFileSync(docsPath, artifactPath);
    console.log(`✓ Saved ${filename}`);
  }

  try {
    // -------------------------------------------------------------
    // 1. OVERVIEW (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Overview (1440x900) ---');
    const context1440 = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context1440.newPage();

    // 01. Overview Expanded Sidebar
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'fb_01_overview_expanded_1440.png');

    // 02. Overview Collapsed Sidebar
    const collapseBtn = page.getByRole('button', { name: /collapse sidebar/i });
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(400);
      await saveScreenshot(page, 'fb_02_overview_collapsed_1440.png');
      // Re-expand
      const expandBtn = page.getByRole('button', { name: /expand sidebar/i });
      if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(400);
      }
    }

    // 03. Overview Commerce Nexus close-up
    await page.evaluate(() => window.scrollTo(0, 150));
    await page.waitForTimeout(500);
    await saveScreenshot(page, 'fb_03_overview_nexus_1440.png');

    // -------------------------------------------------------------
    // 2. SALES INTELLIGENCE (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Sales Intelligence (1440x900) ---');
    await page.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'fb_04_sales_main_1440.png');

    // 05. Sales temporal charts
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_05_sales_temporal_1440.png');

    // 06. Sales connected exploration
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_06_sales_connected_1440.png');

    // -------------------------------------------------------------
    // 3. CUSTOMER INTELLIGENCE & CONSTELLATION (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Customer Intelligence (1440x900) ---');
    await page.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'fb_07_customer_overview_1440.png');

    // 08. 3D Constellation Default
    await page.evaluate(() => window.scrollTo(0, 220));
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'fb_08_customer_constellation_1440.png');

    // 09. Cluster 0 selected
    const c0Btn = page.getByRole('button', { name: /Cluster 0: Core/i });
    if (await c0Btn.isVisible()) {
      await c0Btn.click();
      await page.waitForTimeout(900);
      await saveScreenshot(page, 'fb_09_customer_cluster0_1440.png');
    }

    // 10. Cluster 1 selected
    const c1Btn = page.getByRole('button', { name: /Cluster 1: Browsers/i });
    if (await c1Btn.isVisible()) {
      await c1Btn.click();
      await page.waitForTimeout(900);
      await saveScreenshot(page, 'fb_10_customer_cluster1_1440.png');
    }

    // 11. Radar mode
    const radarBtn = page.locator('button[aria-label="2D Radar Mode"]');
    if (await radarBtn.isVisible()) {
      await radarBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'fb_11_customer_radar_1440.png');
    }

    // 12. Data Table mode
    const tableBtn = page.locator('button[aria-label="Data Table Mode"]');
    if (await tableBtn.isVisible()) {
      await tableBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'fb_12_customer_table_1440.png');
    }

    // 13. PCA variance & stepper
    await page.evaluate(() => window.scrollTo(0, 1100));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_13_customer_pca_1440.png');

    // 14. K-Means sensitivity explorer
    await page.evaluate(() => window.scrollTo(0, 1750));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_14_customer_kmeans_1440.png');

    // -------------------------------------------------------------
    // 4. DATA EXPLORER (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Data Explorer (1440x900) ---');
    await page.goto(`${BASE_URL}/data-explorer`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'fb_15_explorer_brands_1440.png');

    // 16. Categories tab
    const catTabBtn = page.getByRole('button', { name: /Category Hierarchy/i });
    if (await catTabBtn.isVisible()) {
      await catTabBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'fb_16_explorer_categories_1440.png');
    }

    // 17. Products tab
    const prodTabBtn = page.getByRole('button', { name: /Product Leaders/i });
    if (await prodTabBtn.isVisible()) {
      await prodTabBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'fb_17_explorer_products_1440.png');
    }

    // -------------------------------------------------------------
    // 5. ML INSIGHTS (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing ML Insights (1440x900) ---');
    await page.goto(`${BASE_URL}/ml-insights`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'fb_18_ml_insights_1440.png');

    // -------------------------------------------------------------
    // 6. DATA PIPELINE (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Data Pipeline (1440x900) ---');
    await page.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'fb_19_pipeline_flow_1440.png');

    // 20. Cleaning audit
    await page.evaluate(() => {
      const el = document.getElementById('cleaning-audit');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    const dedupToggle = page.getByRole('button', { name: /Deduplication Audit/i });
    if (await dedupToggle.isVisible()) {
      await dedupToggle.click();
      await page.waitForTimeout(400);
    }
    await saveScreenshot(page, 'fb_20_pipeline_cleaning_1440.png');

    // 21. Lineage registry
    await page.evaluate(() => {
      const el = document.getElementById('lineage-explorer');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_21_pipeline_lineage_1440.png');

    // 22. Research visualization gallery
    await page.evaluate(() => {
      const el = document.getElementById('research-gallery');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_22_pipeline_gallery_1440.png');

    // 23. Gallery Lightbox modal
    const firstGalleryCard = page.locator('#research-gallery .group.relative.rounded-xl').first();
    if (await firstGalleryCard.isVisible()) {
      await firstGalleryCard.click();
      await page.waitForTimeout(600);
      await saveScreenshot(page, 'fb_23_pipeline_lightbox_1440.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // 24. Chart Studio with Native Sunburst
    await page.evaluate(() => {
      const el = document.getElementById('chart-studio');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    const sunburstTab = page.getByRole('button', { name: /Category & Brand Sunburst Partition/i });
    if (await sunburstTab.isVisible()) {
      await sunburstTab.click();
      await page.waitForTimeout(800);
      await saveScreenshot(page, 'fb_24_pipeline_studio_sunburst_1440.png');
    }

    // -------------------------------------------------------------
    // 7. 404 ROUTING BOUNDARY (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing 404 Boundary (1440x900) ---');
    await page.goto(`${BASE_URL}/nonexistent-route-audit`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'fb_25_notfound_1440.png');

    // -------------------------------------------------------------
    // 8. INTERMEDIATE DESKTOP (1280x800)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Intermediate Desktop (1280x800) ---');
    const context1280 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page1280 = await context1280.newPage();
    await page1280.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page1280.waitForTimeout(1200);
    await saveScreenshot(page1280, 'fb_26_overview_desktop_1280.png');

    await page1280.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await page1280.waitForTimeout(1200);
    await saveScreenshot(page1280, 'fb_27_sales_desktop_1280.png');

    // -------------------------------------------------------------
    // 9. TABLET VIEWPORT (768x1024)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Tablet Viewport (768x1024) ---');
    const contextTablet = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
    });
    const pageTablet = await contextTablet.newPage();
    await pageTablet.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await pageTablet.waitForTimeout(1200);
    await saveScreenshot(pageTablet, 'fb_28_overview_tablet_768.png');

    await pageTablet.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
    await pageTablet.waitForTimeout(1200);
    await saveScreenshot(pageTablet, 'fb_29_customer_tablet_768.png');

    // -------------------------------------------------------------
    // 10. MOBILE VIEWPORT (390x844)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Mobile Viewport (390x844) ---');
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const pageMobile = await contextMobile.newPage();

    // 30. Mobile Overview
    await pageMobile.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'fb_30_overview_mobile_390.png');

    // 31. Mobile Sales Intelligence
    await pageMobile.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'fb_31_sales_mobile_390.png');

    // 32. Mobile Customer Intelligence
    await pageMobile.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'fb_32_customer_mobile_390.png');

    console.log('\n✓ ALL 32 FOREST & BRASS THEME SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    await browser.close();
    server.close();
  }
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
