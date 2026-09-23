import {cp,mkdir,symlink,access} from 'node:fs/promises';import path from 'node:path';
const out='output/block-1/baseline-app';await mkdir(out,{recursive:true});for(const name of ['src','package.json','next.config.ts','tsconfig.json','next-env.d.ts','postcss.config.mjs']){const from=name==='next-env.d.ts'||name==='postcss.config.mjs'?name:'output/block-1/before/'+name;await cp(from,out+'/'+name,{recursive:true});}
for(const name of ['public','node_modules']){const link=path.resolve(out,name);try{await access(link);}catch{await symlink(path.resolve(name),link,'junction');}}
console.log('Isolated baseline ready');
