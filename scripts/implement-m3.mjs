import {writeFile,readFile} from 'node:fs/promises';
const put=(path,text)=>writeFile(path,text.trimStart());
await put('src/lib/vehicles.ts',`
import snapshot from '@/data/vehicles.generated.json';
export type VehicleStatus='available'|'reserved'|'sold'|'unavailable';
export type VehicleImage={src:string;alt:string;source?:string;width?:number;height?:number};
export interface Vehicle {id:string;slug:string;make:string;model:string;version?:string;modelYear:number;manufactureYear?:number;mileageKm:number;price:number;bodyType?:string;fuel?:string;transmission?:string;color?:string;condition:string;features:string[];images:VehicleImage[];coverImage:string;featured:boolean;status:VehicleStatus;source:{provider:string;sourceUrl:string;externalId:string;retrievedAt:string};notes:string[];year:number;mileage:number;fuelType:string;gallery:string[];description:string;demo:boolean;badge?:string;engine?:string;horsepower?:string;drivetrain?:string;exteriorColor?:string;interiorColor?:string;doors?:number;seats?:number;owners?:number;serviceHistory?:string;warranty?:string}
export const vehicles:Vehicle[]=snapshot.vehicles.map(v=>({...v,status:v.status as VehicleStatus,year:v.modelYear,mileage:v.mileageKm,fuelType:v.fuel||'',gallery:v.images.map(i=>i.src),description:v.make+' '+v.model+' '+v.version+' '+v.modelYear+'. Consulte disponibilidade, documentação e condições com a M3.',demo:false}));
export const lastUpdatedAt=snapshot.lastUpdatedAt;
export const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
export const number=(value:number)=>new Intl.NumberFormat('pt-BR').format(value);
export const vehicleName=(v:Vehicle)=>v.make+' '+v.model;
export const heroVehicle=vehicles.find(v=>v.model==='HR-V'&&v.modelYear===2023)!;
`);
await put('next.config.ts',`import type {NextConfig} from 'next';
const config:NextConfig={images:{remotePatterns:[{protocol:'https',hostname:'images.usadosbr.com',pathname:'/media/gallery/**'}]}};export default config;
`);
let d=await readFile('src/lib/dealership.ts','utf8');d=d.replace("instagram: ''","instagram: 'https://www.instagram.com/m3_autopremium/'").replace('demoInventory: true','demoInventory: false');d=d.replace(/  team: \[[\s\S]*?\n  \],/,'  team: [],');await put('src/lib/dealership.ts',d);
await put('src/components/m3/brand.tsx',`import Image from 'next/image';
export function Brand(){return <span className="brand-lockup"><span className="brand-symbol"><Image src="/brand/m3-logo.webp" width={90} height={60} alt=""/></span><span>M3 <small>AUTO PREMIUM</small></span></span>}
`);
let h=await readFile('src/components/m3/header.tsx','utf8');h=h.replace("import {CTA}","import {Brand} from './brand';\nimport {CTA}").replace('>M3 AUTO PREMIUM</Link>',' aria-label="M3 Auto Premium — início"><Brand/></Link>');await put('src/components/m3/header.tsx',h);
await put('src/components/m3/home.tsx',`
import Link from 'next/link';
import {CTA,Photo,SectionHeading} from './primitives';
import {dealership,mapsUrl} from '@/lib/dealership';
import {vehicles,heroVehicle,money} from '@/lib/vehicles';
import {VehicleGrid} from './vehicle-card';
import {FAQ} from './faq';
export function Services(){return <section className="container m3-services"><SectionHeading eyebrow="COM A M3" title="Seu carro. Seu próximo passo."/><div className="service-rows">{[['01','Escolha seu próximo carro','Compare fotos, versões e valores. Depois, conheça o veículo pessoalmente.','/estoque','Explorar estoque'],['02','Venda com a M3','Converse sobre consignação e avaliação. Entenda as condições antes de decidir.','/venda-seu-carro','Quero vender'],['03','Planeje o financiamento','Consulte as possibilidades para o veículo escolhido. Condições sujeitas à análise de crédito.','/financiamento','Consultar condições']].map(([n,title,copy,href,label])=><div key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p><Link href={href}>{label} ↗</Link></div>)}</div></section>}
export function Home(){return <><section className="m3-hero container"><div className="m3-hero-copy"><p className="eyebrow">M3 AUTO PREMIUM · ITAIM PAULISTA</p><h1>O próximo carro.<br/>A sua escolha.</h1><p>Fotos reais, informações à mão e uma conversa direta. Encontre seu próximo carro aqui, na zona leste de São Paulo.</p><CTA href="/estoque">Explorar o estoque</CTA><a className="hero-location" href={mapsUrl} target="_blank" rel="noreferrer">Rua Manoel de Castilho, 404 ↗</a></div><Link href={'/estoque/'+heroVehicle.slug} className="m3-hero-visual" aria-label="Conhecer Honda HR-V EXL 2023"><Photo src={heroVehicle.coverImage} alt={heroVehicle.images[0].alt} priority sizes="(max-width:809px) 100vw, 65vw"/><div className="hero-car-caption"><div><small>EM DESTAQUE NA M3</small><h2>Honda HR-V</h2><p>EXL · 2023 · {money(heroVehicle.price)}</p></div><span aria-hidden="true">↗</span></div></Link></section><div className="section-stack"><section className="container featured-section"><SectionHeading eyebrow="ESTOQUE M3" title="Encontre o que faz sentido para você." description="Consulte os anúncios e fale com a loja para confirmar disponibilidade e condições." href="/estoque"/><VehicleGrid vehicles={vehicles.filter(v=>v.featured)}/></section><Services/><section className="container m3-visit"><div><p className="eyebrow">PERTO DE VOCÊ</p><h2>Conheça o carro.<br/>Conheça a M3.</h2></div><div><p>{dealership.address}</p><p>Veja os detalhes de perto, tire suas dúvidas e converse sobre compra, venda ou consignação.</p><CTA href="/contato">Planejar minha visita</CTA><a href={dealership.instagram} target="_blank" rel="noreferrer">Acompanhe @m3_autopremium ↗</a></div></section><FAQ/></div></>}
`);
await put('src/components/m3/vehicle-card.tsx',`
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {Vehicle,money,number,vehicleName} from '@/lib/vehicles';
import {Photo} from './primitives';
export function VehicleCard({vehicle:v}:{vehicle:Vehicle}){return <Link className="vehicle-card" href={'/estoque/'+v.slug}><div className="card-image"><Photo src={v.coverImage} alt={v.images[0]?.alt||vehicleName(v)} sizes="(max-width:809px) 100vw, (max-width:1199px) 50vw, 33vw"/><span className="corner-arrow" aria-hidden="true"><ArrowRight size={20}/></span></div><div className="vehicle-card-info"><h3>{vehicleName(v)}</h3><p className="card-version">{v.version}</p><div><span>{v.modelYear} · {number(v.mileageKm)} km</span><strong>{money(v.price)}</strong></div></div></Link>}
export function VehicleGrid({vehicles}:{vehicles:Vehicle[]}){return <div className="vehicle-grid">{vehicles.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div>}
`);
await put('src/app/sobre/page.tsx',`
import {PageHero,CTA} from '@/components/m3/primitives';import {Services} from '@/components/m3/home';import {dealership} from '@/lib/dealership';import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Sobre a M3','Seminovos, venda, consignação e financiamento no Itaim Paulista, São Paulo. Conheça a M3 Auto Premium.','/sobre');
export default function Page(){return <><PageHero title="A M3 está no seu caminho." description="No Itaim Paulista, em São Paulo, a M3 Auto Premium trabalha com venda de veículos, consignação e financiamento." href="/contato" cta="Conhecer a loja"/><div className="section-stack"><section className="container m3-visit"><div><p className="eyebrow">M3 AUTO PREMIUM</p><h2>Uma conversa direta.<br/>Uma escolha informada.</h2></div><div><p>Comprar ou vender um carro começa com informação. Aqui você encontra fotos dos veículos anunciados pela M3, preços e detalhes para comparar suas opções.</p><p>Antes de fechar negócio, confirme disponibilidade, equipamentos e condições com a loja. Agende uma visita em {dealership.street}.</p><CTA href="/estoque">Conhecer os veículos</CTA></div></section><Services/></div></>}
`);
let f=await readFile('src/components/m3/footer.tsx','utf8');f=f.replace("import {CTA}","import {Brand} from './brand';\nimport {CTA}");f=f.replace('<h2>Pronto','<Brand/><h2>Pronto');f=f.replace('Uma seleção especial. Uma conversa com calma.<br/>Conheça a M3 Auto Premium.','{dealership.address}<br/><a href={dealership.phoneHref}>{dealership.phone}</a> · <a href={dealership.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>');await put('src/components/m3/footer.tsx',f);
let p=await readFile('src/components/m3/primitives.tsx','utf8');p=p.replace("import {media,whatsappUrl}","import {media,whatsappUrl}");const start=p.indexOf('export function CTASection()'),end=p.indexOf('export function PageHero',start);p=p.slice(0,start)+`export function CTASection(){return <section className="container m3-contact-strip"><div><p className="eyebrow">VAMOS CONVERSAR</p><h2>Ficou com alguma dúvida?</h2><p>Consulte disponibilidade ou combine uma visita à M3.</p></div><CTA>Falar com a M3</CTA></section>}\n`+p.slice(end);await put('src/components/m3/primitives.tsx',p);
let g=await readFile('src/components/m3/vehicle-gallery.tsx','utf8');g=g.replace('imagem ilustrativa','foto').replace('Galeria ilustrativa do template','Fotos do anúncio da M3');await put('src/components/m3/vehicle-gallery.tsx',g);
await put('src/app/estoque/page.tsx',`import {Inventory} from '@/components/m3/inventory';import {pageMetadata} from '@/lib/metadata';export const metadata=pageMetadata('Carros à venda no Itaim Paulista','Consulte o estoque da M3 Auto Premium: fotos reais, preços e detalhes. Filtre por marca, ano, preço e quilometragem.','/estoque');export default function Page(){return <><div className="container inventory-heading"><p className="eyebrow">ESTOQUE M3</p><h1>Seu próximo carro está aqui.</h1><p>Compare as opções. Escolha os detalhes que importam.</p></div><Inventory/></>}
`);
