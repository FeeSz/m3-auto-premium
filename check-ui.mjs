import { chromium } from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3002',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2000); await page.getByRole('button',{name:'Abrir menu'}).click();
assert.equal(await page.getByRole('button',{name:'Fechar menu'}).getAttribute('aria-expanded'),'true');
await page.getByRole('navigation').getByRole('link',{name:'Seminovos',exact:true}).click();
assert.equal(await page.getByRole('button',{name:'Abrir menu'}).getAttribute('aria-expanded'),'false');
for(const [category,count] of [['SUV',3],['Sedan',1],['Hatch',2],['Todos',6]]){
 await page.getByRole('button',{name:category,exact:true}).click();
 assert.equal(await page.locator('.vehicle').count(),count);
}
assert.match(await page.getByRole('link',{name:'Consultar Toyota Corolla',exact:true}).getAttribute('href'),/wa.me\/5511930055771/);
assert.equal(await page.locator('video').count(),0);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.locator('#localizacao').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({path:'output/playwright/location.png'});
const report={menu:true,filters:{SUV:3,Sedan:1,Hatch:2,Todos:6},whatsappDestination:true,noMissingVideoRequests:true,noHorizontalOverflow:true,pageErrors:errors};
assert.deepEqual(errors,[]);
await writeFile('output/playwright/interactions.json',JSON.stringify(report,null,2));
console.log(report);await browser.close();

