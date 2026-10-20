import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');
const DOCS_M04_DIR = path.resolve(__dirname, '../../../docs/commerceiq/screenshots/m04');
const ARTIFACT_M04_DIR = 'C:\\Users\\madhur\\.gemini\\antigravity\\brain\\df233eea-f06a-4b6f-858f-e91eb03fa3eb\\screenshots\\m04';

[DOCS_M04_DIR, ARTIFACT_M04_DIR].forEach((dir) => {
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
      console.log(`M04 Production Preview server active at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function capture() {
  const PORT = 4178;
  const server = await startServer(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  console.log('Launching browser for M04 Data Pipeline & Research Provenance captures...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();

  const saveScreenshot = async (page: any, name: string) => {
    const docPath = path.join(DOCS_M04_DIR, `${name}.png`);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_M04_DIR)) {
      try {
        fs.copyFileSync(docPath, path.join(ARTIFACT_M04_DIR, `${name}.png`));
      } catch {}
    }
    console.log(`  ✓ Saved ${name}.png`);
  };

  // 1. M04-01: Desktop Hero at 1440x900
  console.log('Capturing m04_01_desktop_hero_1440...');
  const page1 = await context.newPage();
  await page1.setViewportSize({ width: 1440, height: 900 });
  await page1.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
  await page1.waitForTimeout(1600);
  await saveScreenshot(page1, 'm04_01_desktop_hero_1440');

  // 2. M04-02: Pipeline Stages Flow (Section A)
  console.log('Capturing m04_02_pipeline_stages_1440...');
  await page1.evaluate(() => {
    document.getElementById('pipeline-flow')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  // Select Stage 3 (Spark Cleaning)
  const stage3Btn = page1.locator('button:has-text("Spark Cleaning")').first();
  if (await stage3Btn.isVisible()) {
    await stage3Btn.click();
    await page1.waitForTimeout(400);
  }
  await saveScreenshot(page1, 'm04_02_pipeline_stages_1440');

  // 3. M04-03: Data Cleaning Audit (Section B)
  console.log('Capturing m04_03_cleaning_audit_1440...');
  await page1.evaluate(() => {
    document.getElementById('cleaning-audit')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  // Open deduplication details
  const dedupBtn = page1.locator('button:has-text("Deduplication Audit")').first();
  if (await dedupBtn.isVisible()) {
    await dedupBtn.click();
    await page1.waitForTimeout(400);
  }
  await saveScreenshot(page1, 'm04_03_cleaning_audit_1440');

  // 4. M04-04: Lineage Explorer Grid Cards (Section C)
  console.log('Capturing m04_04_lineage_explorer_1440...');
  await page1.evaluate(() => {
    document.getElementById('lineage-explorer')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm04_04_lineage_explorer_1440');

  // 5. M04-05: Lineage Explorer Table Mode (Section C)
  console.log('Capturing m04_05_lineage_table_view_1440...');
  const tableModeBtn = page1.locator('button:has-text("Registry Table")').first();
  if (await tableModeBtn.isVisible()) {
    await tableModeBtn.click();
    await page1.waitForTimeout(400);
  }
  await saveScreenshot(page1, 'm04_05_lineage_table_view_1440');

  // Reset to Grid mode
  const gridModeBtn = page1.locator('button:has-text("Interactive Grid")').first();
  if (await gridModeBtn.isVisible()) {
    await gridModeBtn.click();
    await page1.waitForTimeout(300);
  }

  // 6. M04-06: Visualization Gallery (Section D)
  console.log('Capturing m04_06_visualization_gallery_1440...');
  await page1.evaluate(() => {
    document.getElementById('research-gallery')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm04_06_visualization_gallery_1440');

  // 7. M04-07: Lightbox Modal Preview (Section D)
  console.log('Capturing m04_07_gallery_lightbox_modal_1440...');
  const firstCard = page1.locator('[role="button"]:has-text("Event Type Distribution")').first();
  if (await firstCard.isVisible()) {
    await firstCard.click();
    await page1.waitForTimeout(700);
    await saveScreenshot(page1, 'm04_07_gallery_lightbox_modal_1440');
    // Close modal
    await page1.keyboard.press('Escape');
    await page1.waitForTimeout(400);
  }

  // 8. M04-08: Interactive Chart Studio - Funnel (Section E)
  console.log('Capturing m04_08_chart_studio_funnel_1440...');
  await page1.evaluate(() => {
    document.getElementById('chart-studio')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm04_08_chart_studio_funnel_1440');

  // 9. M04-09: Interactive Chart Studio - Treemap (Section E)
  console.log('Capturing m04_09_chart_studio_treemap_1440...');
  const treemapTab = page1.locator('button:has-text("Category & Brand Revenue Treemap")').first();
  if (await treemapTab.isVisible()) {
    await treemapTab.click();
    await page1.waitForTimeout(800);
  }
  await saveScreenshot(page1, 'm04_09_chart_studio_treemap_1440');

  // 10. M04-10: Interactive Chart Studio - Bubble (Section E)
  console.log('Capturing m04_10_chart_studio_bubble_1440...');
  const bubbleTab = page1.locator('button:has-text("Product Revenue & Purchase Bubble Matrix")').first();
  if (await bubbleTab.isVisible()) {
    await bubbleTab.click();
    await page1.waitForTimeout(800);
  }
  await saveScreenshot(page1, 'm04_10_chart_studio_bubble_1440');

  // 11. M04-11: Interactive Chart Studio - Legacy Sandbox (Section E)
  console.log('Capturing m04_11_chart_studio_legacy_sandbox_1440...');
  const sandboxBtn = page1.locator('button:has-text("Legacy Plotly (Sandbox)")').first();
  if (await sandboxBtn.isVisible()) {
    await sandboxBtn.click();
    await page1.waitForTimeout(1000);
  }
  await saveScreenshot(page1, 'm04_11_chart_studio_legacy_sandbox_1440');

  // 12. M04-12: Methodology Walkthrough (Section F)
  console.log('Capturing m04_12_methodology_walkthrough_1440...');
  await page1.evaluate(() => {
    document.getElementById('methodology-walkthrough')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1.waitForTimeout(600);
  await saveScreenshot(page1, 'm04_12_methodology_walkthrough_1440');

  await page1.close();

  // 13. M04-13: Intermediate Desktop at 1280x800
  console.log('Capturing m04_13_desktop_1280...');
  const page2 = await context.newPage();
  await page2.setViewportSize({ width: 1280, height: 800 });
  await page2.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1600);
  await saveScreenshot(page2, 'm04_13_desktop_1280');
  await page2.close();

  // 14. M04-14: Tablet at 768x1024
  console.log('Capturing m04_14_tablet_768...');
  const page3 = await context.newPage();
  await page3.setViewportSize({ width: 768, height: 1024 });
  await page3.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
  await page3.waitForTimeout(1600);
  await saveScreenshot(page3, 'm04_14_tablet_768');
  await page3.close();

  // 15. M04-15: Mobile at 390x844
  console.log('Capturing m04_15_mobile_390...');
  const page4 = await context.newPage();
  await page4.setViewportSize({ width: 390, height: 844 });
  await page4.goto(`${BASE_URL}/data-pipeline`, { waitUntil: 'networkidle' });
  await page4.waitForTimeout(1600);
  await saveScreenshot(page4, 'm04_15_mobile_390');
  await page4.close();

  await browser.close();
  server.close();
  console.log('M04 Screenshot suite execution complete.');
}

capture().catch((err) => {
  console.error('M04 Capture error:', err);
  process.exit(1);
});
