import { chromium } from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const root='output/playwright/reference';
await page.goto('https://car-dealership.framer.website/',{waitUntil:'networkidle'});
const report={};
report.dom=await page.locator('body').ariaSnapshot();
report.styles=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const s=getComputedStyle(e);return {name:e.getAttribute('data-framer-name'),tag:e.tagName,position:s.position,z:s.zIndex,radius:s.borderRadius,shadow:s.boxShadow,bg:s.backgroundColor,transition:s.transition,transform:s.transform}}).filter(x=>x.position==='sticky'||x.position==='fixed'||x.shadow!=='none'||x.transition!=='all 0s ease 0s'));
for(const [name,y] of [['featured',1120],['services',1850],['testimonials',2630],['team',3520],['blog',4100],['faq',5290],['footer',5800]]) {
 await page.evaluate(y=>scrollTo(0,y),y); await page.waitForTimeout(1400); await page.screenshot({path:`${root}/home-section-${name}.png`});
}
const question=page.getByText('What financing options do you offer?',{exact:true}).first();
await question.click();await page.waitForTimeout(700);report.faqAfter=await page.locator('body').ariaSnapshot();await page.screenshot({path:`${root}/faq-open.png`});
await page.setViewportSize({width:390,height:844});await page.goto('https://car-dealership.framer.website/',{waitUntil:'networkidle'});report.mobile=await page.locator('body').ariaSnapshot();
report.mobileNav=await page.locator('nav').evaluateAll(es=>es.map(e=>e.outerHTML));
await page.screenshot({path:`${root}/home-390-first.png`});
await writeFile(`${root}/interactions.json`,JSON.stringify(report,null,2));
await browser.close();
