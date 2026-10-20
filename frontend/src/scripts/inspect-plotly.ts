import fs from 'fs';
import path from 'path';


const files = [
  '25_product_bubble_chart.html',
  '26_category_brand_treemap.html',
  '27_category_brand_sunburst.html',
  '29_event_funnel.html',
];

const basePath = path.resolve(process.cwd(), '../ecommerce_bigdata_showcase/results/additional_visualizations');

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const plotCallIdx = content.indexOf('Plotly.newPlot(');
  if (plotCallIdx === -1) {
    console.log(`No Plotly.newPlot in ${file}`);
    continue;
  }

  // Find the arguments of Plotly.newPlot(id, data, layout)
  const callSub = content.slice(plotCallIdx);
  const firstComma = callSub.indexOf(',');
  const openBracket = callSub.indexOf('[', firstComma);

  // Find matching bracket for data
  let depth = 0;
  let closeBracket = -1;
  for (let i = openBracket; i < callSub.length; i++) {
    if (callSub[i] === '[') depth++;
    else if (callSub[i] === ']') {
      depth--;
      if (depth === 0) {
        closeBracket = i;
        break;
      }
    }
  }

  if (closeBracket !== -1) {
    const dataJsonStr = callSub.slice(openBracket, closeBracket + 1);
    try {
      const data = JSON.parse(dataJsonStr);
      console.log(`\n================== ${file} ==================`);
      console.log('Trace type:', data[0]?.type);
      console.log('Trace keys:', Object.keys(data[0] || {}));
      if (file === '25_product_bubble_chart.html') {
        const xBuf = Buffer.from(data[0].x.bdata, 'base64');
        const xInts = new Int16Array(xBuf.buffer, xBuf.byteOffset, xBuf.length / 2);
        console.log('Bubble chart point count:', xInts.length);
        console.log('First 5 x (purchases):', Array.from(xInts.slice(0, 5)));

        const yBuf = Buffer.from(data[0].y.bdata, 'base64');
        const yFloats = new Float64Array(yBuf.buffer, yBuf.byteOffset, yBuf.length / 8);
        console.log('First 5 y (revenue):', Array.from(yFloats.slice(0, 5)));

        console.log('Sample hovertext:', data[0].hovertext?.slice(0, 5));
        console.log('Marker keys:', Object.keys(data[0].marker || {}));
      }
      if (data[0]?.x) {
        console.log('X type:', typeof data[0].x, Object.keys(data[0].x));
        if (data[0].x.bdata) {
          const buf = Buffer.from(data[0].x.bdata, 'base64');
          console.log('X bdata byte length:', buf.length, 'dtype:', data[0].x.dtype);
          if (data[0].x.dtype === 'i4') {
            const ints = new Int32Array(buf.buffer, buf.byteOffset, buf.length / 4);
            console.log('Decoded first 5 ints:', Array.from(ints.slice(0, 5)));
          } else if (data[0].x.dtype === 'f8') {
            const floats = new Float64Array(buf.buffer, buf.byteOffset, buf.length / 8);
            console.log('Decoded first 5 floats:', Array.from(floats.slice(0, 5)));
          }
        }
      }
    } catch (e: any) {
      console.log(`JSON parse error in ${file}:`, e.message);
    }
  }
}
