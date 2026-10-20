import fs from 'fs';
import path from 'path';

const srcBase = path.resolve(process.cwd(), '../ecommerce_bigdata_showcase/results');
const destBase = path.resolve(process.cwd(), 'public/visualizations');

const dirs = [
  { src: path.join(srcBase, 'phase7'), dest: path.join(destBase, 'phase7'), filter: (f: string) => f.endsWith('.png') },
  { src: path.join(srcBase, 'additional_visualizations'), dest: path.join(destBase, 'additional'), filter: (f: string) => f.endsWith('.png') },
  { src: path.join(srcBase, 'additional_visualizations'), dest: path.join(destBase, 'plotly'), filter: (f: string) => f.endsWith('.html') },
];

for (const dir of dirs) {
  if (!fs.existsSync(dir.dest)) {
    fs.mkdirSync(dir.dest, { recursive: true });
  }
  const files = fs.readdirSync(dir.src).filter(dir.filter);
  for (const file of files) {
    fs.copyFileSync(path.join(dir.src, file), path.join(dir.dest, file));
  }
  console.log(`Copied ${files.length} files to ${dir.dest}`);
}

console.log('All visualization assets copied successfully.');
