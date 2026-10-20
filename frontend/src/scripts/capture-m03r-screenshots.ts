import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M03R_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m03r');
const ARTIFACT_M03R_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m03r';

[DOCS_M03R_DIR, ARTIFACT_M03R_DIR].forEach((dir) => {
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
      console.log(`M03-R Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4176;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for M03-R Customer Intelligence audit captures...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const saveScreenshot = async (page: any, name: string) => {
    const docPath = path.join(DOCS_M03R_DIR, `${name}.png`);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_M03R_DIR)) {
      try {
        fs.copyFileSync(docPath, path.join(ARTIFACT_M03R_DIR, `${name}.png`));
      } catch {}
    }
    console.log(`  ✓ Saved ${name}.png`);
  };

  // 1. M03R-01: Desktop Hero at 1440x900
  console.log('Capturing m03r_01_desktop_hero_1440...');
  const page1 = await context.newPage();
  await page1.setViewportSize({ width: 1440, height: 900 });
  await page1.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page1.waitForTimeout(1600);
  await saveScreenshot(page1, 'm03r_01_desktop_hero_1440');

  // 2. M03R-02: Segment Explorer Side-by-Side
  console.log('Capturing m03r_02_segment_side_by_side_1440...');
  const bothBtn = page1.locator('button:has-text("Side-by-Side")');
  if (await bothBtn.isVisible()) {
    await bothBtn.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03r_02_segment_side_by_side_1440');

  // 3. M03R-03: Detailed Metric Table Mode
  console.log('Capturing m03r_03_segment_table_mode_1440...');
  const tableToggle = page1.locator('button[aria-label="Detailed Metrics Table Mode"]');
  if (await tableToggle.isVisible()) {
    await tableToggle.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03r_03_segment_table_mode_1440');

  // Reset to visual mode
  const visualToggle = page1.locator('button[aria-label="Visual Radar Mode"]');
  if (await visualToggle.isVisible()) {
    await visualToggle.click();
    await page1.waitForTimeout(400);
  }

  // 4. M03R-04: Behavioral Comparison Lab
  console.log('Capturing m03r_04_behavioral_comparison_lab_1440...');
  await page1.evaluate(() => {
    window.scrollTo({ top: 760, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03r_04_behavioral_comparison_lab_1440');

  // 5. M03R-05: PCA Stepper
  console.log('Capturing m03r_05_pca_stepper_1440...');
  await page1.evaluate(() => {
    window.scrollTo({ top: 1800, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03r_05_pca_stepper_1440');

  // 6. M03R-06: K-Means Sensitivity Explorer with Heuristic annotation
  console.log('Capturing m03r_06_kmeans_sensitivity_heuristic_1440...');
  await page1.evaluate(() => {
    window.scrollTo({ top: 2450, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03r_06_kmeans_sensitivity_heuristic_1440');

  // 7. M03R-07: Outlier Investigation with Counterfactual Toggle
  console.log('Capturing m03r_07_outlier_counterfactual_1440...');
  await page1.evaluate(() => {
    window.scrollTo({ top: 3100, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03r_07_outlier_counterfactual_1440');

  await page1.close();

  // 8. M03R-08: Intermediate Desktop at 1280x800
  console.log('Capturing m03r_08_desktop_1280...');
  const page2 = await context.newPage();
  await page2.setViewportSize({ width: 1280, height: 800 });
  await page2.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1600);
  await saveScreenshot(page2, 'm03r_08_desktop_1280');
  await page2.close();

  // 9. M03R-09: Tablet at 768x1024
  console.log('Capturing m03r_09_tablet_768...');
  const page3 = await context.newPage();
  await page3.setViewportSize({ width: 768, height: 1024 });
  await page3.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page3.waitForTimeout(1600);
  await saveScreenshot(page3, 'm03r_09_tablet_768');
  await page3.close();

  // 10. M03R-10: Mobile at 390x844
  console.log('Capturing m03r_10_mobile_390...');
  const page4 = await context.newPage();
  await page4.setViewportSize({ width: 390, height: 844 });
  await page4.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page4.waitForTimeout(1600);
  await saveScreenshot(page4, 'm03r_10_mobile_390');
  await page4.close();

  await browser.close();
  server.close();
  console.log('M03-R Screenshot suite execution complete.');
}

capture().catch((err) => {
  console.error('M03-R Capture error:', err);
  process.exit(1);
});
