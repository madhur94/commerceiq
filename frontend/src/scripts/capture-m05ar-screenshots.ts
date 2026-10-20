import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M05AR_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m05ar');
const ARTIFACT_M05AR_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m05ar';

[DOCS_M05AR_DIR, ARTIFACT_M05AR_DIR].forEach((dir) => {
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
      console.log(`M05-A-R Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4184;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for M05-A-R Refined Customer Constellation captures...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const saveScreenshot = async (page: any, name: string) => {
    const docPath = path.join(DOCS_M05AR_DIR, `${name}.png`);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_M05AR_DIR)) {
      try {
        fs.copyFileSync(docPath, path.join(ARTIFACT_M05AR_DIR, `${name}.png`));
      } catch {}
    }
    console.log(`  ✓ Saved ${name}.png`);
  };

  // 1. M05AR-01: Default Camera at 1440x900 - Refined Framing (+38% Prominence), Circular Points, Centroids
  console.log('Capturing m05ar_01_default_camera_1440...');
  const page1 = await context.newPage();
  await page1.setViewportSize({ width: 1440, height: 900 });
  await page1.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
  await page1.waitForTimeout(2200);

  // Scroll to Customer Segment Explorer
  await page1.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find((el) =>
      el.textContent?.includes('Customer Segment Explorer')
    );
    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await page1.waitForTimeout(1500);
  await saveScreenshot(page1, 'm05ar_01_default_camera_1440');

  // 2. M05AR-02: Cluster 0 Selected (High Activity Core)
  console.log('Capturing m05ar_02_cluster0_selected_1440...');
  const c0Btn = page1.locator('button:has-text("Cluster 0: Core")').first();
  if (await c0Btn.isVisible()) {
    await c0Btn.click();
    await page1.waitForTimeout(1600);
  }
  await saveScreenshot(page1, 'm05ar_02_cluster0_selected_1440');

  // 3. M05AR-03: Cluster 1 Selected (Casual Browsers)
  console.log('Capturing m05ar_03_cluster1_selected_1440...');
  const c1Btn = page1.locator('button:has-text("Cluster 1: Browsers")').first();
  if (await c1Btn.isVisible()) {
    await c1Btn.click();
    await page1.waitForTimeout(1600);
  }
  await saveScreenshot(page1, 'm05ar_03_cluster1_selected_1440');

  // 4. M05AR-04: Camera Rotated / Orbited
  console.log('Capturing m05ar_04_camera_rotated_1440...');
  const bothBtn = page1.locator('button:has-text("Both Clusters")').first();
  if (await bothBtn.isVisible()) {
    await bothBtn.click();
    await page1.waitForTimeout(1200);
  }
  const canvasRegion = page1.locator('div[role="region"][aria-label*="Customer Constellation"]').first();
  if (await canvasRegion.isVisible()) {
    const box = await canvasRegion.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      await page1.mouse.move(startX, startY);
      await page1.mouse.down();
      await page1.mouse.move(startX - 220, startY + 70, { steps: 15 });
      await page1.mouse.up();
      await page1.waitForTimeout(800);
    }
  }
  await saveScreenshot(page1, 'm05ar_04_camera_rotated_1440');

  // 5. M05AR-05: Camera Zoomed In on Cluster 0 Core
  console.log('Capturing m05ar_05_camera_zoomed_1440...');
  // Press '0' key to isolate Cluster 0
  await canvasRegion.press('0');
  await page1.waitForTimeout(800);
  // Zoom in using '+' key multiple times
  for (let i = 0; i < 4; i++) {
    await canvasRegion.press('+');
    await page1.waitForTimeout(100);
  }
  await page1.waitForTimeout(800);
  await saveScreenshot(page1, 'm05ar_05_camera_zoomed_1440');

  // 6. M05AR-06: Hover Detail over Cluster
  console.log('Capturing m05ar_06_hover_detail_1440...');
  // Reset camera first with 'R'
  await canvasRegion.press('r');
  const hoverBox = await canvasRegion.boundingBox();
  if (hoverBox) {
    const hoverX = hoverBox.x + hoverBox.width * 0.35;
    const hoverY = hoverBox.y + hoverBox.height * 0.48;
    await page1.mouse.move(hoverX, hoverY, { steps: 10 });
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm05ar_06_hover_detail_1440');

  // 7. M05AR-07: 2D Radar Mode Preserved
  console.log('Capturing m05ar_07_radar_mode_preserved_1440...');
  const radarModeBtn = page1.locator('button[aria-label="2D Radar Mode"]').first();
  if (await radarModeBtn.isVisible()) {
    await radarModeBtn.click();
    await page1.waitForTimeout(1000);
  }
  await saveScreenshot(page1, 'm05ar_07_radar_mode_preserved_1440');

  // 8. M05AR-08: Data Table Mode Preserved
  console.log('Capturing m05ar_08_table_mode_preserved_1440...');
  const tableModeBtn = page1.locator('button[aria-label="Data Table Mode"]').first();
  if (await tableModeBtn.isVisible()) {
    await tableModeBtn.click();
    await page1.waitForTimeout(800);
  }
  await saveScreenshot(page1, 'm05ar_08_table_mode_preserved_1440');
  await page1.close();

  // 9. M05AR-09: Intermediate Desktop at 1280x800
  console.log('Capturing m05ar_09_desktop_1280...');
  const page1280 = await context.newPage();
  await page1280.setViewportSize({ width: 1280, height: 800 });
  await page1280.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
  await page1280.waitForTimeout(1800);
  await page1280.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find((el) =>
      el.textContent?.includes('Customer Segment Explorer')
    );
    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await page1280.waitForTimeout(1500);
  await saveScreenshot(page1280, 'm05ar_09_desktop_1280');
  await page1280.close();

  // 10. M05AR-10: Tablet at 768x1024
  console.log('Capturing m05ar_10_tablet_768...');
  const page768 = await context.newPage();
  await page768.setViewportSize({ width: 768, height: 1024 });
  await page768.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
  await page768.waitForTimeout(1800);
  await page768.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find((el) =>
      el.textContent?.includes('Customer Segment Explorer')
    );
    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await page768.waitForTimeout(1500);
  await saveScreenshot(page768, 'm05ar_10_tablet_768');
  await page768.close();

  // 11. M05AR-11: Mobile 390x844 Default 2D Fallback
  console.log('Capturing m05ar_11_mobile_fallback_390...');
  const page390 = await context.newPage();
  await page390.setViewportSize({ width: 390, height: 844 });
  await page390.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
  await page390.waitForTimeout(1800);
  await page390.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find((el) =>
      el.textContent?.includes('Customer Segment Explorer')
    );
    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await page390.waitForTimeout(1200);
  await saveScreenshot(page390, 'm05ar_11_mobile_fallback_390');

  // 12. M05AR-12: Mobile 390x844 Opt-in 3D Constellation
  console.log('Capturing m05ar_12_mobile_constellation_390...');
  const launch3DBtn = page390.locator('button:has-text("Launch 3D")').first();
  if (await launch3DBtn.isVisible()) {
    await launch3DBtn.click();
    await page390.waitForTimeout(1500);
  } else {
    const mobileConstellTab = page390.locator('button[aria-label="3D Constellation Mode"]').first();
    if (await mobileConstellTab.isVisible()) {
      await mobileConstellTab.click();
      await page390.waitForTimeout(1500);
    }
  }
  await saveScreenshot(page390, 'm05ar_12_mobile_constellation_390');
  await page390.close();

  await browser.close();
  server.close();
  console.log('✓ All 12 M05-A-R screenshots captured and mirrored successfully!');
}

capture().catch((err) => {
  console.error('M05-A-R Capture failed:', err);
  process.exit(1);
});
