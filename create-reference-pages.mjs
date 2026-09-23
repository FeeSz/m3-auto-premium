import {mkdir,writeFile} from 'node:fs/promises';
const files={
'src/app/venda-seu-carro/page.tsx':`import {ServicePage} from '@/components/m3/service-page';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Venda ou troque seu carro','Solicite uma avaliação do seu veículo na M3 Auto Premium, no Itaim Paulista, São Paulo.','/venda-seu-carro');
export default function Page(){return <ServicePage kind="trade"/>}`,
'src/app/financiamento/page.tsx':`import {ServicePage} from '@/components/m3/service-page';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Financiamento automotivo','Converse com a M3 Auto Premium sobre entrada, prazos e possibilidades de financiamento. Sujeito à análise de crédito.','/financiamento');
export default function Page(){return <ServicePage kind="finance"/>}`,
'src/app/sobre/page.tsx':`import {PageHero,Photo,CTA} from '@/components/m3/primitives';
import {Services} from '@/components/m3/home';
import {FAQ} from '@/components/m3/faq';
import {dealership,media} from '@/lib/dealership';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Sobre a M3','Conheça a M3 Auto Premium: veículos, atendimento consultivo e atenção aos detalhes no Itaim Paulista, São Paulo.','/sobre');
export default function Page(){return <><PageHero title="Uma paixão por carros. Uma escolha por confiança." description="A M3 Auto Premium está no Itaim Paulista, em São Paulo. Nosso ponto de partida é entender o que você procura no seu próximo carro." href="/contato" cta="Conhecer a M3"/><div className="section-stack"><section className="container about-mission reveal"><p className="eyebrow">NOSSA ESSÊNCIA</p><h2>Uma escolha que começa com confiança.</h2><div className="mission-grid"><h3>Atenção a você.<br/>Cuidado com cada detalhe.</h3><div><p>Um carro participa dos seus planos, da sua rotina e das suas conquistas. Por isso, acreditamos em uma escolha feita com informação, tempo e atenção.</p><p>Na M3, queremos conhecer suas expectativas e ajudar você a explorar as possibilidades. Converse sobre compra, troca e financiamento com a nossa equipe.</p><CTA href="/contato">Fale com a gente</CTA></div><Photo src="/reference/JZQYXFq6xyKFWX9HQADLnHRQaI.png" alt="Veículo premium em estúdio — fotografia ilustrativa"/></div><div className="about-values"><div><strong>M3</strong><span>Auto Premium</span></div><div><strong>SP</strong><span>Itaim Paulista</span></div><div><strong>Você</strong><span>No centro da conversa</span></div></div></section><section className="container about-team reveal"><div className="about-team-grid">{[...dealership.team,{name:'Avaliação do seu carro',role:'Foto ilustrativa · avaliação',image:'/reference/qwJRMSWMv89SuAENcdd8hyHZA.png'},{name:'Acompanhamento próximo',role:'Foto ilustrativa · suporte',image:'/reference/lKaJxuHjb3mrOTo8uHxqlrUoA.png'}].map(p=><div className="team-card" key={p.name}><Photo src={p.image} alt="Retrato ilustrativo, não representa integrante da M3"/><div><h3>{p.name}</h3><p>{p.role}</p></div></div>)}</div><div><p className="eyebrow">NOSSA EQUIPE</p><h2>Uma conversa feita para você.</h2><p>Conhecer um carro é também conhecer quem está ao seu lado durante a escolha. Traga suas perguntas e seus planos.</p><p>Os retratos desta apresentação são ilustrativos. Venha conhecer pessoalmente a equipe da M3 Auto Premium.</p><CTA href="/contato">Agendar uma visita</CTA><Photo src={media.inspection} alt="Atenção aos detalhes de um veículo — imagem ilustrativa"/></div></section><Services/><FAQ/></div></>}`,
'src/app/contato/page.tsx':`import {MapPin,Phone} from 'lucide-react';
import {LeadForm} from '@/components/m3/lead-form';
import {ShowroomMap} from '@/components/m3/map';
import {FAQ} from '@/components/m3/faq';
import {CTA} from '@/components/m3/primitives';
import {dealership,mapsUrl,whatsappUrl} from '@/lib/dealership';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Contato','Fale com a M3 Auto Premium pelo WhatsApp ou visite a Rua Manoel de Castilho, 404, Itaim Paulista, São Paulo.','/contato');
export default function Page(){return <><section className="container contact-hero"><div className="contact-copy"><div><h1>Vamos conversar sobre seu próximo carro.</h1><a className="profile-link" href={mapsUrl} target="_blank" rel="noreferrer">Conheça nosso perfil no Google ↗</a></div><div><p>A equipe da M3 está pronta para conhecer seus planos. Conte o que você procura e dê o próximo passo com a gente.</p><a className="icon-button" href="#showroom" aria-label="Ver localização"><MapPin size={19}/></a></div></div><LeadForm/></section><div className="section-stack"><section className="container showroom-section" id="showroom"><ShowroomMap/><div><p className="eyebrow">VISITE A M3</p><h2>Seu próximo carro começa aqui.</h2><address>{dealership.address}</address><div className="showroom-contacts"><a href={dealership.phoneHref}><Phone size={18}/>{dealership.phone}</a><a href={whatsappUrl()} target="_blank" rel="noreferrer">Conversar pelo WhatsApp ↗</a>{dealership.instagram&&<a href={dealership.instagram}>Instagram ↗</a>}{dealership.email&&<a href={'mailto:'+dealership.email}>{dealership.email}</a>}<p>Horário: {dealership.openingHours||'consulte a equipe para agendar sua visita.'}</p></div><CTA href={mapsUrl}>Traçar rota</CTA></div></section><FAQ/></div></>}`,
'src/app/blog/page.tsx':`import {PageHero,CTASection} from '@/components/m3/primitives';
import {BlogCard} from '@/components/m3/blog-card';
import {articles} from '@/lib/articles';
import {pageMetadata} from '@/lib/metadata';
export const metadata=pageMetadata('Blog','Guias e histórias sobre escolha, troca e experiência automotiva no blog da M3 Auto Premium.','/blog');
export default function Page(){return <><PageHero title="Ideias, detalhes e histórias sobre o seu próximo carro." description="Conteúdo para conhecer melhor cada escolha. Explore os guias da M3 e encontre respostas para seguir em frente." href="/sobre" cta="Sobre a M3"/><div className="section-stack"><section className="container blog-grid" aria-label="Artigos">{articles.map(a=><BlogCard key={a.slug} article={a}/>)}</section><CTASection/></div></>}`,
'src/app/blog/[slug]/page.tsx':`import {notFound} from 'next/navigation';
import {articles,articleDate} from '@/lib/articles';
import {pageMetadata} from '@/lib/metadata';
import {Photo,CTASection,SectionHeading} from '@/components/m3/primitives';
import {BlogCard} from '@/components/m3/blog-card';
export const generateStaticParams=()=>articles.map(a=>({slug:a.slug}));
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=articles.find(a=>a.slug===slug);return a?pageMetadata(a.title,a.summary,'/blog/'+a.slug,a.image):{title:'Artigo não encontrado'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=articles.find(a=>a.slug===slug);if(!a)notFound();return <><article className="container article-layout"><header className="article-heading"><p className="eyebrow">{a.category} · <time dateTime={a.date}>{articleDate(a.date)}</time></p><h1>{a.title}</h1><p>{a.summary}</p></header><div className="article-body"><Photo src={a.image} alt={a.title} priority/>{a.sections.map((s,i)=><section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}{s.list&&<ul>{s.list.map(item=><li key={item}>{item}</li>)}</ul>}{i===1&&<Photo src="/reference/WyhRtolqAtg9ZPTE92NjlKjv0.webp" alt="Detalhe de acabamento automotivo — imagem ilustrativa"/>}</section>)}<p className="article-signature">M3 Auto Premium · Conteúdo editorial</p></div></article><div className="section-stack"><CTASection/><section className="container"><SectionHeading eyebrow="CONTINUE EXPLORANDO" title="Mais ideias para sua próxima escolha."/><div className="blog-grid">{articles.filter(x=>x.slug!==a.slug).map(a=><BlogCard key={a.slug} article={a}/>)}</div></section></div></>}`,
};
for(const [file,content] of Object.entries(files)){await mkdir(file.slice(0,file.lastIndexOf('/')),{recursive:true});await writeFile(file,content+'\n');}
console.log('Created 6 page families');
