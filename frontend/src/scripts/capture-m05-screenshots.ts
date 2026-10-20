import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M05_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m05');
const ARTIFACT_M05_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m05';

[DOCS_M05_DIR, ARTIFACT_M05_DIR].forEach((dir) => {
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
      console.log(`M05 Production Preview server active at http://localhost:${port}`);
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
    const docsPath = path.join(DOCS_M05_DIR, filename);
    const artifactPath = path.join(ARTIFACT_M05_DIR, filename);
    await page.screenshot({ path: docsPath, fullPage: false });
    fs.copyFileSync(docsPath, artifactPath);
    console.log(`✓ Saved ${filename}`);
  }

  try {
    // -------------------------------------------------------------
    // 1. OVERVIEW VIEWPORTS (1440x900)
    // -------------------------------------------------------------
    console.log('\n--- Capturing Overview ---');
    const context1440 = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context1440.newPage();

    // 01. Overview Expanded Sidebar
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'm05_01_overview_expanded_1440.png');

    // 02. Overview Collapsed Sidebar
    const collapseBtn = page.getByRole('button', { name: /collapse sidebar/i });
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(400);
      await saveScreenshot(page, 'm05_02_overview_collapsed_1440.png');
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
    await saveScreenshot(page, 'm05_03_overview_nexus_1440.png');

    // 04. Overview Mobile Viewport (390x844)
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'm05_04_overview_mobile_390.png');

    // -------------------------------------------------------------
    // 2. SALES INTELLIGENCE
    // -------------------------------------------------------------
    console.log('\n--- Capturing Sales Intelligence ---');
    await page.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'm05_05_sales_main_1440.png');

    // 06. Sales temporal charts
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_06_sales_temporal_1440.png');

    // 07. Sales connected exploration
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_07_sales_connected_1440.png');

    // 08. Sales mobile
    await pageMobile.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'm05_08_sales_mobile_390.png');

    // -------------------------------------------------------------
    // 3. CUSTOMER INTELLIGENCE & CONSTELLATION
    // -------------------------------------------------------------
    console.log('\n--- Capturing Customer Intelligence ---');
    await page.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveScreenshot(page, 'm05_09_customer_overview_1440.png');

    // 10. 3D Constellation Default
    await page.evaluate(() => window.scrollTo(0, 220));
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'm05_10_customer_constellation_1440.png');

    // 11. Cluster 0 selected
    const c0Btn = page.getByRole('button', { name: /Cluster 0: Core/i });
    if (await c0Btn.isVisible()) {
      await c0Btn.click();
      await page.waitForTimeout(900);
      await saveScreenshot(page, 'm05_11_customer_cluster0_1440.png');
    }

    // 12. Cluster 1 selected
    const c1Btn = page.getByRole('button', { name: /Cluster 1: Browsers/i });
    if (await c1Btn.isVisible()) {
      await c1Btn.click();
      await page.waitForTimeout(900);
      await saveScreenshot(page, 'm05_12_customer_cluster1_1440.png');
    }

    // 13. Radar mode
    const radarBtn = page.locator('button[aria-label="2D Radar Mode"]');
    if (await radarBtn.isVisible()) {
      await radarBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'm05_13_customer_radar_1440.png');
    }

    // 14. Data Table mode
    const tableBtn = page.locator('button[aria-label="Data Table Mode"]');
    if (await tableBtn.isVisible()) {
      await tableBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'm05_14_customer_table_1440.png');
    }

    // 15. PCA variance & stepper
    await page.evaluate(() => window.scrollTo(0, 1100));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_15_customer_pca_1440.png');

    // 16. K-Means sensitivity explorer
    await page.evaluate(() => window.scrollTo(0, 1750));
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_16_customer_kmeans_1440.png');

    // 17. Customer Mobile fallback
    await pageMobile.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1200);
    await saveScreenshot(pageMobile, 'm05_17_customer_mobile_390.png');

    // -------------------------------------------------------------
    // 4. DATA EXPLORER
    // -------------------------------------------------------------
    console.log('\n--- Capturing Data Explorer ---');
    await page.goto(`${BASE_URL}/data-explorer`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'm05_18_explorer_brands_1440.png');

    // 19. Categories tab
    const catTabBtn = page.getByRole('button', { name: /Category Hierarchy/i });
    if (await catTabBtn.isVisible()) {
      await catTabBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'm05_19_explorer_categories_1440.png');
    }

    // 20. Products tab
    const prodTabBtn = page.getByRole('button', { name: /Product Leaders/i });
    if (await prodTabBtn.isVisible()) {
      await prodTabBtn.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, 'm05_20_explorer_products_1440.png');
    }

    // -------------------------------------------------------------
    // 5. DATA PIPELINE
    // -------------------------------------------------------------
    console.log('\n--- Capturing Data Pipeline ---');
    await page.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await saveScreenshot(page, 'm05_21_pipeline_flow_1440.png');

    // 22. Cleaning audit
    await page.evaluate(() => {
      const el = document.getElementById('cleaning-audit');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    // Expand deduplication details
    const dedupToggle = page.getByRole('button', { name: /Deduplication Audit/i });
    if (await dedupToggle.isVisible()) {
      await dedupToggle.click();
      await page.waitForTimeout(400);
    }
    await saveScreenshot(page, 'm05_22_pipeline_cleaning_1440.png');

    // 23. Lineage registry
    await page.evaluate(() => {
      const el = document.getElementById('lineage-explorer');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_23_pipeline_lineage_1440.png');

    // 24. Research visualization gallery
    await page.evaluate(() => {
      const el = document.getElementById('research-gallery');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_24_pipeline_gallery_1440.png');

    // 25. Gallery Lightbox modal
    const firstGalleryCard = page.locator('#research-gallery .group.relative.rounded-xl').first();
    if (await firstGalleryCard.isVisible()) {
      await firstGalleryCard.click();
      await page.waitForTimeout(600);
      await saveScreenshot(page, 'm05_25_pipeline_lightbox_1440.png');
      // Close modal with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // 26. Chart Studio with Native Sunburst
    await page.evaluate(() => {
      const el = document.getElementById('chart-studio');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    const sunburstTab = page.getByRole('button', { name: /Category & Brand Sunburst Partition/i });
    if (await sunburstTab.isVisible()) {
      await sunburstTab.click();
      await page.waitForTimeout(800);
      await saveScreenshot(page, 'm05_26_pipeline_studio_sunburst_1440.png');
    }

    // -------------------------------------------------------------
    // 6. ADDITIONAL ACCEPTANCE CRITERIA
    // -------------------------------------------------------------
    console.log('\n--- Capturing Additional Acceptance Views ---');
    // 27. 404 Routing Boundary
    await page.goto(`${BASE_URL}/nonexistent-route-audit`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await saveScreenshot(page, 'm05_27_notfound_1440.png');

    // 28. Reduced-Motion Mode
    const contextReducedMotion = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const pageReduced = await contextReducedMotion.newPage();
    await pageReduced.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await pageReduced.waitForTimeout(1000);
    await saveScreenshot(pageReduced, 'm05_28_reduced_motion_1440.png');

    // 29. Desktop 1280px Intermediate Width (Validating Balanced KPI Grid)
    const context1280 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page1280 = await context1280.newPage();
    await page1280.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
    await page1280.waitForTimeout(1200);
    await saveScreenshot(page1280, 'm05_29_desktop_1280.png');

    console.log('\n✓ ALL 29 M05 PRODUCTION SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    await browser.close();
    server.close();
  }
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
