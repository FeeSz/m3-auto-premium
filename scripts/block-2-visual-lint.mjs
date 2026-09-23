import {chromium} from 'file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const report=[];
try {
  for(const width of [375,768,1280,1920]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:3006/estoque',{waitUntil:'networkidle'});
    const scan=async(state)=>{
      const issues=await page.evaluate(()=>{
        const issues=[];
        const rgb=value=>value.match(/[\d.]+/g)?.map(Number);
        const lum=rgb=>rgb.slice(0,3).map(x=>{x/=255;return x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4;}).reduce((sum,x,i)=>sum+x*[0.2126,0.7152,0.0722][i],0);
        if(document.documentElement.scrollWidth>innerWidth+1)issues.push('Horizontal page overflow');
        for(const image of document.querySelectorAll('#conteudo img'))if(!image.getAttribute('alt'))issues.push('Missing image alt');
        for(const el of document.querySelectorAll('#conteudo button,#conteudo input,#conteudo select,#conteudo label,#conteudo small')){
          if(!el.getClientRects().length)continue;
          const css=getComputedStyle(el),box=el.getBoundingClientRect();
          if(css.visibility==='hidden')continue;
          const name=el.getAttribute('aria-label')||el.textContent.trim().slice(0,45)||el.tagName;
          if(box.left < -1 || box.right>innerWidth+1)issues.push('Control overflow: '+name);
          if(parseFloat(css.fontSize)<12)issues.push('Tiny control text: '+name);
          if(['INPUT','SELECT'].includes(el.tagName)&&!el.labels?.length&&!el.getAttribute('aria-label'))issues.push('Unlabelled control: '+name);
          let parent=el,background;
          while(parent){const color=rgb(getComputedStyle(parent).backgroundColor);if(color && (color.length===3||color[3]===1)){background=color;break;}parent=parent.parentElement;}
          if(background){const foreground=rgb(css.color);if(foreground){const a=lum(foreground),b=lum(background),contrast=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);if(contrast<4.5)issues.push('Low text contrast: '+name+' ('+contrast.toFixed(2)+')');}}
        }
        return issues;
      });
      report.push({width,state,issues});
    };
    await scan('default');
    await page.getByRole('button',{name:width<810?'Filtrar (0)':'Filtros (0)',exact:true}).click();
    await scan('advanced');
    await page.close();
  }
  assert.ok(report.every(row=>row.issues.length===0),JSON.stringify(report));
} finally {await writeFile('output/playwright/block-2/visual-lint.json',JSON.stringify(report,null,2));await browser.close();}
console.log('Visual lint: 8 states passed (overflow, labels, alt text, font size, computed text contrast).');
