import {chromium} from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root='output/research/m3/stock';await mkdir(root,{recursive:true});
const source=JSON.parse(await readFile('output/research/m3/usadosbr.json','utf8'));
const urls=[...new Set(source.links.map(l=>l.href.split('#')[0]).filter(u=>u.includes('/carros-e-utilitarios/')))];
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({userAgent:'M3WebsiteResearch/1.0 (public inventory verification)'});
for(const url of urls){const name=url.split('/').at(-1);try{
 const cached=await readFile(`${root}/${name}.json`,'utf8').catch(()=>null);if(cached){console.log('cached',name);continue;}
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!response.ok())throw Error(`HTTP ${response.status()}`);
 await page.waitForTimeout(1200);
 const data=await page.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,images:[...document.images].map(e=>({src:e.currentSrc||e.src,alt:e.alt})),json:[...document.querySelectorAll('script[type="application/ld+json"],script#__NEXT_DATA__')].map(e=>e.textContent)}));
 await writeFile(`${root}/${name}.json`,JSON.stringify({...data,retrievedAt:new Date().toISOString()},null,2));console.log('saved',name);
 }catch(e){console.error(name,e.message);}await page.waitForTimeout(1000);}
await browser.close();
