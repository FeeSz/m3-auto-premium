import {readFile,mkdir,writeFile,copyFile,access} from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('public/brand',{recursive:true});
await copyFile('C:/Users/felype.souza/Downloads/M3_logo.png','public/brand/m3-logo-original.png');
await sharp('public/brand/m3-logo-original.png').resize(600).webp({quality:90}).toFile('public/brand/m3-logo.webp');
const data=JSON.parse(await readFile('src/data/vehicles.generated.json','utf8'));
await mkdir('output/research/m3/candidates',{recursive:true});
for(const v of data.vehicles.filter(v=>v.featured)){
 const response=await fetch(v.coverImage,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'M3WebsiteResearch/1.0'}});if(!response.ok)throw Error(`${response.status}`);
 await writeFile(`output/research/m3/candidates/${v.model}.webp`,Buffer.from(await response.arrayBuffer()));
 console.log(v.model,v.coverImage);
}
