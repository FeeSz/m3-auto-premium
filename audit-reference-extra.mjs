import { chromium } from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFile,readFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const base='https://car-dealership.framer.website',root='output/playwright/reference',report=[];
await page.goto(base,{waitUntil:'networkidle'});
await page.locator('nav [data-framer-name="Open"]').click();await page.waitForTimeout(1000);
report.push({menu:await page.locator('nav').ariaSnapshot()});await page.screenshot({path:`${root}/mobile-menu-open.png`});
for(const width of [375,430,1024,1920]) {
 await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1400);
 report.push({width,h1:await page.locator('h1').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {fontSize:s.fontSize,lineHeight:s.lineHeight,w:r.width,x:r.x}})});
 await page.screenshot({path:`${root}/home-${width}-first.png`});
}
await page.setViewportSize({width:1440,height:1000});
const inventory=JSON.parse(await readFile(`${root}/inventory-1440.json`,'utf8'));
await page.goto(base+'/blog',{waitUntil:'domcontentloaded'});const blogs=await page.locator('a').evaluateAll(es=>[...new Set(es.map(e=>e.href).filter(x=>x.includes('/blog/')))]);
for(const url of [...inventory.links.filter(x=>x.includes('/inventory/')), ...blogs]){
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(800);
 report.push({url,title:await page.title(),snapshot:await page.locator('body').ariaSnapshot()});
}
await writeFile(`${root}/extra-audit.json`,JSON.stringify(report,null,2));await browser.close();
