import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M03_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m03');
const ARTIFACT_M03_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m03';

[DOCS_M03_DIR, ARTIFACT_M03_DIR].forEach((dir) => {
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
      console.log(`M03 Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4175;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for M03 Customer Intelligence comprehensive capture...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const saveScreenshot = async (page: any, name: string) => {
    const docPath = path.join(DOCS_M03_DIR, `${name}.png`);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_M03_DIR)) {
      try {
        fs.copyFileSync(docPath, path.join(ARTIFACT_M03_DIR, `${name}.png`));
      } catch {}
    }
    console.log(`  ✓ Saved ${name}.png`);
  };

  // 1. M03-01: Desktop Hero at 1440x900
  console.log('Capturing m03_01_customer_hero_1440...');
  const page1 = await context.newPage();
  await page1.setViewportSize({ width: 1440, height: 900 });
  await page1.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page1.waitForTimeout(1600);
  await saveScreenshot(page1, 'm03_01_customer_hero_1440');

  // 2. M03-02: Segment 0 Selected
  console.log('Capturing m03_02_segment_0_selected_1440...');
  const seg0Btn = page1.locator('button:has-text("Cluster 0 (8.29%)")');
  if (await seg0Btn.isVisible()) {
    await seg0Btn.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03_02_segment_0_selected_1440');

  // 3. M03-03: Segment 1 Selected
  console.log('Capturing m03_03_segment_1_selected_1440...');
  const seg1Btn = page1.locator('button:has-text("Cluster 1 (91.71%)")');
  if (await seg1Btn.isVisible()) {
    await seg1Btn.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03_03_segment_1_selected_1440');

  // 4. M03-04: Side-by-Side Comparison
  console.log('Capturing m03_04_side_by_side_comparison_1440...');
  const bothBtn = page1.locator('button:has-text("Side-by-Side")');
  if (await bothBtn.isVisible()) {
    await bothBtn.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03_04_side_by_side_comparison_1440');

  // 5. M03-05: Detailed Metric Table Mode
  console.log('Capturing m03_05_segment_metrics_table_1440...');
  const tableToggle = page1.locator('button[aria-label="Detailed Metrics Table Mode"]');
  if (await tableToggle.isVisible()) {
    await tableToggle.click();
    await page1.waitForTimeout(600);
  }
  await saveScreenshot(page1, 'm03_05_segment_metrics_table_1440');

  // Reset to visual mode for further scrolling captures
  const visualToggle = page1.locator('button[aria-label="Visual Radar Mode"]');
  if (await visualToggle.isVisible()) {
    await visualToggle.click();
    await page1.waitForTimeout(400);
  }

  // 6. M03-06: Behavioral Comparison Lab
  console.log('Capturing m03_06_behavioral_comparison_lab_1440...');
  // Scroll down to Behavioral Comparison Lab
  await page1.evaluate(() => {
    window.scrollBy({ top: 750, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  const purchTab = page1.locator('button:has-text("Average Purchase Count")');
  if (await purchTab.isVisible()) {
    await purchTab.click();
    await page1.waitForTimeout(500);
  }
  await saveScreenshot(page1, 'm03_06_behavioral_comparison_lab_1440');

  // 7. M03-07: Activity Tiers Distribution
  console.log('Capturing m03_07_activity_tiers_distribution_1440...');
  await page1.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  const tierBtn = page1.locator('button:has-text("More than 50 events")');
  if (await tierBtn.isVisible()) {
    await tierBtn.click();
    await page1.waitForTimeout(500);
  }
  await saveScreenshot(page1, 'm03_07_activity_tiers_distribution_1440');

  // 8. M03-08: PCA Explainer Stepper
  console.log('Capturing m03_08_pca_explainer_stepper_1440...');
  await page1.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  const step5Btn = page1.locator('button:has-text("STEP 5")');
  if (await step5Btn.isVisible()) {
    await step5Btn.click();
    await page1.waitForTimeout(500);
  }
  await saveScreenshot(page1, 'm03_08_pca_explainer_stepper_1440');

  // 9. M03-09: K-Means Model Architecture & Sensitivity
  console.log('Capturing m03_09_kmeans_model_sensitivity_1440...');
  await page1.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03_09_kmeans_model_sensitivity_1440');

  // 10. M03-10: Outlier Investigation Case Study
  console.log('Capturing m03_10_outlier_case_study_1440...');
  await page1.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'instant' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm03_10_outlier_case_study_1440');
  await page1.close();

  // 11. M03-11: Compact Laptop Layout (1280x800)
  console.log('Capturing m03_11_customer_intelligence_1280...');
  const page1280 = await context.newPage();
  await page1280.setViewportSize({ width: 1280, height: 800 });
  await page1280.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await page1280.waitForTimeout(1600);
  await saveScreenshot(page1280, 'm03_11_customer_intelligence_1280');
  await page1280.close();

  // 12. M03-12: Intermediate 1280px Sales Intelligence Layout Verification
  console.log('Capturing m03_12_sales_kpi_1280_layout...');
  const pageSales1280 = await context.newPage();
  await pageSales1280.setViewportSize({ width: 1280, height: 800 });
  await pageSales1280.goto(`${BASE_URL}/sales-intelligence`, { waitUntil: 'networkidle' });
  await pageSales1280.waitForTimeout(1600);
  await saveScreenshot(pageSales1280, 'm03_12_sales_kpi_1280_layout');
  await pageSales1280.close();

  // 13. M03-13: Tablet Layout (768x1024)
  console.log('Capturing m03_13_customer_intelligence_tablet_768...');
  const pageTablet = await context.newPage();
  await pageTablet.setViewportSize({ width: 768, height: 1024 });
  await pageTablet.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(1600);
  await saveScreenshot(pageTablet, 'm03_13_customer_intelligence_tablet_768');
  await pageTablet.close();

  // 14. M03-14: Mobile Layout (390x844)
  console.log('Capturing m03_14_customer_intelligence_mobile_390...');
  const pageMobile = await context.newPage();
  await pageMobile.setViewportSize({ width: 390, height: 844 });
  await pageMobile.goto(`${BASE_URL}/customer-intelligence`, { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1600);
  await saveScreenshot(pageMobile, 'm03_14_customer_intelligence_mobile_390');

  // 15. M03-15: Mobile Methodology Notice Expanded
  console.log('Capturing m03_15_mobile_methodology_expanded_390...');
  const expandBtn = pageMobile.locator('button:has-text("View Methodology Details")');
  if (await expandBtn.first().isVisible()) {
    await expandBtn.first().click();
    await pageMobile.waitForTimeout(400);
  }
  await saveScreenshot(pageMobile, 'm03_15_mobile_methodology_expanded_390');
  await pageMobile.close();

  await browser.close();
  server.close();
  console.log('\n✓ Successfully captured all 15 M03 screenshots into docs/commerceiq/screenshots/m03/ and brain artifact directory!');
}

capture().catch((err) => {
  console.error('M03 screenshot capture failed:', err);
  process.exit(1);
});
