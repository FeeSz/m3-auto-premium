import {readFile,writeFile,mkdir,access} from 'node:fs/promises';import sharp from 'sharp';
// Development asset cache. Publication rights must be confirmed by M3.
const file='src/data/vehicles.generated.json';const data=JSON.parse(await readFile(file,'utf8'));const manifest=[];
for(const v of data.vehicles){v.images=v.images.filter(i=>(i.remoteSrc||i.src).startsWith('https://images.usadosbr.com/media/gallery/'));await mkdir(`public/vehicles/${v.slug}`,{recursive:true});for(let i=0;i<v.images.length;i++){
 const image=v.images[i];const remote=image.remoteSrc||image.src;if(!remote.startsWith('https://images.usadosbr.com/media/gallery/'))throw Error('Unexpected image host');
 const local=`/vehicles/${v.slug}/${String(i+1).padStart(2,'0')}.webp`;
 try{await access('public'+local);}catch{let success=false;for(let attempt=0;attempt<2;attempt++){try{const response=await fetch(remote,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'M3WebsiteDevelopment/1.0'}});if(!response.ok)throw Error('HTTP '+response.status);const bytes=Buffer.from(await response.arrayBuffer());await sharp(bytes).rotate().resize({width:1440,withoutEnlargement:true}).webp({quality:82}).toFile('public'+local);success=true;break;}catch(e){if(attempt===1)throw e;await new Promise(r=>setTimeout(r,1500));}}if(!success)throw Error('Image unavailable');await new Promise(r=>setTimeout(r,250));}
 const metadata=await sharp('public'+local).metadata();image.src=local;image.remoteSrc=remote;image.width=metadata.width;image.height=metadata.height;manifest.push({local,remote,source:image.source,usage:'development; publication authorization pending'});
 }v.coverImage=v.images[0]?.src||'/brand/m3-logo.webp';if(!v.images.length)v.notes.push('Fotografias indisponíveis na fonte consultada. Solicite imagens atualizadas à M3.');console.log(v.model,v.images.length);}
await writeFile(file,JSON.stringify(data,null,2));await writeFile('docs/vehicle-image-manifest.json',JSON.stringify(manifest,null,2));
