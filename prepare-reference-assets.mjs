import { readdir,readFile,mkdir,writeFile } from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root='output/playwright/reference';
const files=(await readdir(root)).filter(x=>x.endsWith('-1440.json'));
const docs=await Promise.all(files.map(async f=>({name:f,data:JSON.parse(await readFile(`${root}/${f}`,'utf8'))})));
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext();
await mkdir('public/reference',{recursive:true});await mkdir('public/fonts',{recursive:true});
const manifest={images:{},pages:{},fonts:[]};
for(const {name,data} of docs){
 manifest.pages[name.replace('-1440.json','')]=[];
 for(const img of data.images){
  const url=new URL(img.src);if(url.hostname!=='framerusercontent.com')continue;
  const file=url.pathname.split('/').pop();if(!file)continue;
  const local=`/reference/${file}`;
  manifest.pages[name.replace('-1440.json','')].push({src:local,alt:img.alt,width:img.w,height:img.h});
  if(manifest.images[local])continue;
  url.searchParams.delete('scale-down-to');
  const response=await context.request.get(url.href);
  if(response.ok()){await writeFile(`public${local}`,await response.body());manifest.images[local]={source:url.href,alt:img.alt,authorization:'User confirmed template and image reuse authorization on 2026-09-15'};}
 }
}
const home=docs.find(x=>x.name==='home-1440.json').data;
for(const css of home.css.filter(x=>x.startsWith('@font-face')&&x.includes('font-family: "Space Grotesk";'))){
 const url=css.match(/url\("([^"]+)/)[1],weight=css.match(/font-weight: (\d+)/)[1];
 const response=await context.request.get(url);if(!response.ok())throw Error('Font download failed');
 await writeFile(`public/fonts/space-grotesk-${weight}.woff2`,await response.body());manifest.fonts.push({weight,source:url});
}
await writeFile(`${root}/asset-manifest.json`,JSON.stringify(manifest,null,2));
await browser.close();console.log(`${Object.keys(manifest.images).length} images, ${manifest.fonts.length} fonts`);
