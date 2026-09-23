import {readFileSync,writeFileSync} from 'node:fs';
const file='src/components/home.tsx';let text=readFileSync(file,'utf8');
function replace(from,to){if(!text.includes(from))throw new Error('Missing: '+from.slice(0,90));text=text.replace(from,to);}
replace("import { useEffect, useRef, useState } from 'react';", "import { useEffect, useRef, useState } from 'react';\nimport dynamic from 'next/dynamic';\nimport { InterfaceMotion, ReviewCarousel, EXPO } from './interface-motion';\nimport { VehicleCard } from './vehicle-card';\nconst FrameCanvas = dynamic(() => import('./frame-canvas')); ");
replace("motion, useReducedMotion, useScroll, useTransform, animate, useInView", "useReducedMotion, animate, useInView");
const start=text.indexOf('function Reveal('),end=text.indexOf('function Cinema(');
text=text.slice(0,start)+`function Reveal({children, className = '', id, variant = 0}: { children: React.ReactNode; className?: string; id?: string; variant?: number }) {
 return <section id={id} className={className} data-reveal={variant}>{children}</section>;
}
`+text.slice(end);
replace('duration:1.3,onUpdate:setN','duration:1.3,ease:EXPO,onUpdate:setN');
replace("const [menu,setMenu]=useState(false);const [filter,setFilter]=useState('Todos');const reduce=useReducedMotion();const {scrollY}=useScroll();const y=useTransform(scrollY,[0,900],[0,170]);", "const [menu,setMenu]=useState(false);const [filter,setFilter]=useState('Todos');\n useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setMenu(false);document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[]);");
replace('<header>','<InterfaceMotion/><header data-compact="false">');
replace("className={menu?'open':''}","className={menu?'open':''} id=\"main-navigation\"");
replace('aria-expanded={menu}', 'aria-expanded={menu} aria-controls="main-navigation"');
for (const label of ['Por que a M3','Seminovos','Experiência M3','Nossa loja']) replace(`>${label}</a>`,`>${label}<span className="nav-indicator" aria-hidden="true"/></a>`);
replace('<section id="inicio" className="hero">','<div className="hero-pin"><section id="inicio" className="hero">');
replace('<motion.div className="hero-background" style={{y:reduce?0:y}}><Cinema hero/></motion.div>','<div className="hero-background"><Cinema hero/>{media.heroFrames.length>1&&<FrameCanvas frames={media.heroFrames}/>}</div><div className="hero-spotlight" aria-hidden="true"/>');
replace('</a></div></section>','</a></div></section></div>');
const vehicleStart=text.indexOf('{vehicles.filter('),vehicleEnd=text.indexOf('</motion.article>)}',vehicleStart);
if(vehicleStart<0||vehicleEnd<0)throw new Error('vehicle block missing');
text=text.slice(0,vehicleStart)+`{vehicles.filter(v=>filter==='Todos'||v.category===filter).map(v=><VehicleCard key={v.model} vehicle={v}/>)}`+text.slice(vehicleEnd+'</motion.article>)}'.length);
const reviewStart=text.indexOf("{[['Atenção de verdade'"),reviewEnd=text.indexOf('</small>',reviewStart);
if(reviewStart<0||reviewEnd<0)throw new Error('review block missing');
text=text.slice(0,reviewStart)+'<ReviewCarousel/>'+text.slice(reviewEnd+'</small>'.length);
replace('<section className="journey section" id="processo">','<section className="journey section" id="processo"><span className="tone-veil tone-light" aria-hidden="true"/>');
replace('<div className="steps">','<div className="steps" aria-label="Etapas da compra">');
replace('<motion.article key={title} initial={false} whileInView={reduce?{}:{opacity:[.45,1],x:[18,0]}} viewport={{once:true,amount:.8}} transition={{duration:.5}}>','<article key={title}>');
replace('<div><h3>{title}</h3><p>{text}</p></div></motion.article>','<div><div className="step-art" aria-hidden="true">{i===0?<MessageCircle/>:i===1?<MapPin/>:i===2?<ShieldCheck/>:i===3?<WalletCards/>:<Check/>}</div><h3>{title}</h3><p>{text}</p></div></article>');
replace('</div></div></section>\n <Reveal className="shell section trade"','</div><div className="journey-progress" aria-label="Ir para etapa">{steps.map(([title],i)=><button key={title} data-step={i} aria-label={`Etapa ${i+1}: ${title}`} aria-pressed={i===0}>{String(i+1).padStart(2,\'0\')}</button>)}</div></div></section>\n <Reveal className="shell section trade"');
// Fixed clipping masks with a transform-only reveal preserve the explicit motion restriction.
text=text.replace(/<(h[12])>([^{}]*?)<\/(h[12])>/g,(all,tag,content)=>`<${tag}>${content.split('<br/>').map(line=>`<span className="headline-line"><span>${line}</span></span>`).join('')}</${tag}>`);
writeFileSync(file,text);
