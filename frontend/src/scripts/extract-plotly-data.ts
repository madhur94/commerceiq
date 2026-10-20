import fs from 'fs';
import path from 'path';

const basePath = path.resolve(process.cwd(), '../ecommerce_bigdata_showcase/results/additional_visualizations');

// 1. Extract Treemap Data
const treemapHtml = fs.readFileSync(path.join(basePath, '26_category_brand_treemap.html'), 'utf8');
const treemapPlotIdx = treemapHtml.indexOf('Plotly.newPlot(');
const treemapSub = treemapHtml.slice(treemapPlotIdx);
const treemapOpen = treemapSub.indexOf('[');
let d = 0;
let treemapClose = -1;
for (let i = treemapOpen; i < treemapSub.length; i++) {
  if (treemapSub[i] === '[') d++;
  else if (treemapSub[i] === ']') {
    d--;
    if (d === 0) {
      treemapClose = i;
      break;
    }
  }
}
const treemapData = JSON.parse(treemapSub.slice(treemapOpen, treemapClose + 1))[0];
const valuesBuf = Buffer.from(treemapData.values.bdata, 'base64');
const values = Array.from(new Float64Array(valuesBuf.buffer, valuesBuf.byteOffset, valuesBuf.length / 8));

const treemapNodes = treemapData.ids.map((id: string, idx: number) => ({
  id,
  label: treemapData.labels[idx],
  parent: treemapData.parents[idx],
  value: Math.round(values[idx] * 100) / 100,
}));

fs.writeFileSync(
  path.resolve(process.cwd(), 'src/data/categoryBrandTreemap.json'),
  JSON.stringify(treemapNodes, null, 2)
);
console.log(`Saved ${treemapNodes.length} treemap nodes to categoryBrandTreemap.json`);

// 2. Extract Bubble Chart Data
const bubbleHtml = fs.readFileSync(path.join(basePath, '25_product_bubble_chart.html'), 'utf8');
const bubblePlotIdx = bubbleHtml.indexOf('Plotly.newPlot(');
const bubbleSub = bubbleHtml.slice(bubblePlotIdx);
const bubbleOpen = bubbleSub.indexOf('[');
d = 0;
let bubbleClose = -1;
for (let i = bubbleOpen; i < bubbleSub.length; i++) {
  if (bubbleSub[i] === '[') d++;
  else if (bubbleSub[i] === ']') {
    d--;
    if (d === 0) {
      bubbleClose = i;
      break;
    }
  }
}
const bubbleData = JSON.parse(bubbleSub.slice(bubbleOpen, bubbleClose + 1))[0];

const xBuf = Buffer.from(bubbleData.x.bdata, 'base64');
const purchases = Array.from(new Int16Array(xBuf.buffer, xBuf.byteOffset, xBuf.length / 2));

const yBuf = Buffer.from(bubbleData.y.bdata, 'base64');
const revenues = Array.from(new Float64Array(yBuf.buffer, yBuf.byteOffset, yBuf.length / 8));

const sizeBuf = Buffer.from(bubbleData.marker.size.bdata, 'base64');
const buyers = Array.from(new Int16Array(sizeBuf.buffer, sizeBuf.byteOffset, sizeBuf.length / 2));

const colorBuf = Buffer.from(bubbleData.marker.color.bdata, 'base64');
const prices = Array.from(new Float64Array(colorBuf.buffer, colorBuf.byteOffset, colorBuf.length / 8));

// Hovertext might be string array or base64
let hovertexts: string[] = [];
if (Array.isArray(bubbleData.hovertext)) {
  hovertexts = bubbleData.hovertext;
} else if (bubbleData.hovertext?.bdata) {
  // Try to parse or fallback
  hovertexts = purchases.map((_, i) => `Product #${i + 1}`);
} else {
  hovertexts = purchases.map((_, i) => `Product #${i + 1}`);
}

const bubblePoints = purchases.map((purch, idx) => ({
  product_rank: idx + 1,
  product_label: hovertexts[idx] || `Product #${idx + 1}`,
  purchases: purch,
  revenue: Math.round(revenues[idx] * 100) / 100,
  unique_buyers: buyers[idx],
  average_price: Math.round(prices[idx] * 100) / 100,
}));

fs.writeFileSync(
  path.resolve(process.cwd(), 'src/data/productBubbleData.json'),
  JSON.stringify(bubblePoints, null, 2)
);
console.log(`Saved ${bubblePoints.length} bubble points to productBubbleData.json`);
