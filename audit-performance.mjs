import lighthouse from 'lighthouse';
import { chromium } from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import desktop from 'lighthouse/core/config/desktop-config.js';
const mode=process.argv[2]||'mobile';
const port=9237;
const browser=await chromium.launch({channel:'chrome',headless:true,args:[`--remote-debugging-port=${port}`]});
try {
 const result=await lighthouse(process.argv[3]||'http://127.0.0.1:3011',{port,output:['json','html'],onlyCategories:['performance'],logLevel:'error'},mode==='desktop'?desktop:undefined);
 if(!result)throw new Error('Lighthouse returned no result');
 await mkdir('output/lighthouse',{recursive:true});
 const name=`output/lighthouse/after-${mode}`;
 await writeFile(`${name}.json`,result.report[0]);await writeFile(`${name}.html`,result.report[1]);
 console.log(JSON.stringify({mode,score:result.lhr.categories.performance.score,metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(id=>[id,result.lhr.audits[id].displayValue])),warnings:result.lhr.runWarnings},null,2));
} finally {await browser.close();}
