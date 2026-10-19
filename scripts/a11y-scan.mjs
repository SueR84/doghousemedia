/**
 * WCAG 2.2 AA scan with axe-core.
 * Run: npm run build && npm run preview   (in one terminal)
 *      npm run a11y                        (in another)
 * Scans every page in dist/ at desktop, mobile and reduced motion.
 * Writes a11y-report.json and prints a summary.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.A11Y_BASE || 'http://localhost:4321';
const root = 'dist';
const routes = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html' && !fs.readFileSync(p, 'utf8').includes('http-equiv="refresh"'))
      routes.push(('/' + path.relative(root, path.dirname(p))).replace(/\\/g, '/').replace(/\/?$/, '/'));
  }
})(root);
routes.sort();

const configs = [
  { name: 'desktop', viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' },
  { name: 'mobile', viewport: { width: 375, height: 812 }, reducedMotion: 'no-preference' },
  { name: 'reduced-motion', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' },
];

const browser = await chromium.launch();
const report = [];
for (const c of configs) {
  const ctx = await browser.newContext({ viewport: c.viewport, reducedMotion: c.reducedMotion });
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(base + r, { waitUntil: 'load' });
    // Scroll through so scroll reveals finish before testing.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((z) => setTimeout(z, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const res = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    for (const v of res.violations)
      for (const n of v.nodes)
        report.push({ config: c.name, route: r, rule: v.id, impact: v.impact, help: v.help, target: n.target.join(' '), detail: n.failureSummary });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync('a11y-report.json', JSON.stringify(report, null, 1));
const byRule = {};
for (const i of report) (byRule[i.rule] ??= new Set()).add(i.route);
console.log(`${routes.length} pages x ${configs.length} configs, ${report.length} failing elements`);
for (const [rule, pages] of Object.entries(byRule)) console.log(`  ${rule}: ${[...pages].join(', ')}`);
process.exit(report.length ? 1 : 0);
