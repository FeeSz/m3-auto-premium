import { chromium } from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const root='output/playwright/reference';
await mkdir(root,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const base='https://car-dealership.framer.website';
await page.goto(base,{waitUntil:'networkidle'});
const links=await page.locator('a').evaluateAll(es=>[...new Set(es.map(e=>e.href).filter(h=>h.startsWith(location.origin)))]);
await writeFile(`${root}/routes.json`,JSON.stringify(links,null,2));
const routes=['/','/inventory','/inventory/krynox-zr_9','/trade-in','/financing','/about-us','/contact','/blog',...links.filter(x=>/\/blog\/|terms|privacy|cookie/.test(x)).map(x=>new URL(x).pathname),'/not-a-real-page'];
const all=[];
for(const route of [...new Set(routes)]) {
  const name=route==='/'?'home':route.slice(1).replaceAll('/','_');
  for(const width of [1440,1280,768,390]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(base+route,{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(700);
    const height=await page.evaluate(()=>document.body.scrollHeight);
    for(let y=0;y<height;y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(140);}
    await page.waitForTimeout(1100);
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(500);
    const data=await page.evaluate(()=>{
      const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
      const style=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,text:e.textContent?.trim().slice(0,160),x:r.x,y:r.y+scrollY,w:r.width,h:r.height,...Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','padding','gap','borderRadius','maxWidth','position','objectFit','objectPosition','transform','transition'].map(k=>[k,s[k]]))}};
      return {url:location.href,title:document.title,width:innerWidth,height:document.body.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).map(style),text:[...document.querySelectorAll('p,button,input,label,select,nav a')].filter(visible).slice(0,95).map(style),sections:[...document.querySelectorAll('section,header,footer,nav')].filter(visible).map(style),images:[...document.images].filter(visible).map(e=>({...style(e),src:e.currentSrc,alt:e.alt})),links:[...new Set([...document.querySelectorAll('a')].map(e=>e.href))],fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})),assets:performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/woff|css|\.mjs/.test(x)),inputs:[...document.querySelectorAll('input,select,textarea')].map(e=>({tag:e.tagName,type:e.type,name:e.name,placeholder:e.placeholder,options:e.tagName==='SELECT'?[...e.options].map(o=>o.text):undefined})),css:[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].map(r=>r.cssText).filter(x=>/@font-face|@media/.test(x))}catch{return []}})};
    });
    await writeFile(`${root}/${name}-${width}.json`,JSON.stringify(data,null,2));
    await page.screenshot({path:`${root}/${name}-${width}.png`,fullPage:true});
    if(width===1440)await page.screenshot({path:`${root}/${name}-first.png`});
    all.push({route,width,title:data.title,height:data.height,headings:data.headings,inputs:data.inputs});
    console.log(name,width,data.height);
  }
}
await writeFile(`${root}/summary.json`,JSON.stringify(all,null,2));
await browser.close();
