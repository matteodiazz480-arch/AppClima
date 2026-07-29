const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

function render(svgPath, outPath, size, background) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background,
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(outPath, png);
  console.log(`wrote ${outPath} (${size}x${size})`);
}

const logo = path.join(__dirname, 'logo.svg');
const mark = path.join(__dirname, 'mark.svg');
const markMono = path.join(__dirname, 'mark-mono.svg');

render(logo, path.join(ASSETS, 'icon.png'), 1024);
render(mark, path.join(ASSETS, 'android-icon-foreground.png'), 512, 'rgba(0,0,0,0)');
render(logo, path.join(ASSETS, 'android-icon-background.png'), 512);
render(markMono, path.join(ASSETS, 'android-icon-monochrome.png'), 432, 'rgba(0,0,0,0)');
render(mark, path.join(ASSETS, 'splash-icon.png'), 1024, 'rgba(0,0,0,0)');
render(logo, path.join(ASSETS, 'favicon.png'), 48);
