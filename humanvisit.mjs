import { chromium } from 'playwright';
// Headed browser, real user agent — a legitimate visit from this PC that GA will count.
const b = await chromium.launch({ headless: false });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
const hits = [];
p.on('request', (r) => { if (r.url().includes('/g/collect')) hits.push(1); });
await p.goto('https://pjempire.co/?realtest', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(4000);
await p.evaluate(() => window.scrollTo(0, 1500));
await p.waitForTimeout(8000);
console.log('user agent:', await p.evaluate(() => navigator.userAgent));
console.log('collect beacons sent:', hits.length);
await b.close();
