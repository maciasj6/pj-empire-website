import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const hits = [];
p.on('request', (r) => {
  const u = r.url();
  if (u.includes('googletagmanager.com') || u.includes('google-analytics.com') || u.includes('/g/collect')) hits.push(u.slice(0, 110));
});
await p.goto('https://pjempire.co/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);
console.log('tag in DOM:', await p.evaluate(() => !!document.querySelector('script[src*="googletagmanager"]')));
console.log('gtag loaded:', await p.evaluate(() => typeof window.gtag === 'function'));
console.log('GA network hits:');
hits.forEach((h) => console.log('  ', h));
if (hits.some((h) => h.includes('/g/collect'))) console.log('>>> BEACON FIRED — this visit is now in Realtime');
else console.log('>>> NO COLLECT BEACON');
await b.close();
