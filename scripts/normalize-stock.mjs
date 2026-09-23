import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
const dir='output/research/m3/stock';const vehicles=[],conflicts=[],seen=new Map();
const listing=JSON.parse(await readFile('output/research/m3/usadosbr.json','utf8'));
const listingRows=JSON.parse(listing.json.at(-1)).props.pageProps.dehydratedState.queries.find(q=>q.state.data.vehicles).state.data.vehicles.data;
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const file of (await readdir(dir)).sort()){
 const evidence=JSON.parse(await readFile(`${dir}/${file}`,'utf8'));
 const raw=JSON.parse(evidence.json.find(x=>x.startsWith('{"props"'))).props.pageProps.details.vehicle;
 if(raw.advertiser.id!==610283)throw Error('Unexpected advertiser');
 if(!raw.images?.length){const cover=listingRows.find(v=>v.id===raw.id)?.image;raw.images=cover?[cover]:[];conflicts.push({id:raw.id,field:'images',decision:'Detail gallery empty; use verified listing cover only'});}
 if(!Number.isFinite(raw.value)||raw.value<=0||!Number.isFinite(raw.km)||raw.km<0||!raw.images?.length)throw Error(`Invalid ${raw.id}: price=${raw.value} km=${raw.km} images=${raw.images?.length}`);
 const make=raw.version.model.brand.name,model=raw.version.model.name,version=raw.version.name;
 const key=[make,model,version,raw.yearMod,raw.km].join('|');
 if(seen.has(key)){conflicts.push({type:'duplicate',retained:seen.get(key),excluded:raw.id,url:evidence.url});continue;}seen.set(key,raw.id);
 const notes=[];const statedKm=raw.comments.match(/KM\s*:\s*([\d.]+)/i);
 if(statedKm&&Number(statedKm[1].replaceAll('.',''))!==raw.km){notes.push('A quilometragem diverge entre a ficha e a descrição do anúncio. Confirme com a M3.');conflicts.push({id:raw.id,field:'mileageKm',structured:raw.km,description:statedKm[1],decision:'Use structured field; disclose conflict'});}
 let fuel=raw.fuel?.name==='Á/G'?'Flex':raw.fuel?.name;let transmission=raw.shifter?.name;
 if(model==='Range Rover Evoque'){conflicts.push({id:raw.id,field:'fuel',value:fuel,version,decision:'Omit pending confirmation'});fuel=undefined;notes.push('Combustível e versão sujeitos à confirmação na documentação do veículo.');}
 if(model==='Spin'&&evidence.url.includes('manual')&&transmission==='Automático'){conflicts.push({id:raw.id,field:'transmission',value:transmission,decision:'Omit due to URL conflict'});transmission=undefined;notes.push('Câmbio sujeito à confirmação com a M3.');}
 const images=raw.images.map((im,i)=>({src:`https://images.usadosbr.com${im.name}`,alt:`${make} ${model} ${raw.yearMod} ${raw.color?.name?.toLowerCase()||''} — foto ${i+1} do anúncio`,source:evidence.url}));
 vehicles.push({id:String(raw.id),slug:slug(`${make}-${model}-${version}-${raw.yearMod}`),make,model,version,modelYear:raw.yearMod,manufactureYear:raw.yearMan,mileageKm:raw.km,price:raw.value,bodyType:raw.style?.name,fuel,transmission,color:raw.color?.name,condition:raw.zero?'new':'used',features:raw.optionals.map(o=>o.name),images,coverImage:images[0].src,featured:['HR-V','Nivus','Tera'].includes(model)&&raw.yearMod>=2023,status:raw.status==='active'?'available':'unavailable',source:{provider:'usadosbr',sourceUrl:evidence.url,externalId:String(raw.id),retrievedAt:evidence.retrievedAt},notes});
}
await mkdir('src/data',{recursive:true});await writeFile('src/data/vehicles.generated.json',JSON.stringify({lastUpdatedAt:new Date().toISOString(),vehicles},null,2));await writeFile('docs/stock-conflicts.json',JSON.stringify(conflicts,null,2));console.log(`${vehicles.length} vehicles; ${conflicts.length} conflicts recorded`);
