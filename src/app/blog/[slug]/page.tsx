import { notFound } from "next/navigation";
import { getArticles, articleDate } from "@/lib/articles";
import { pageMetadata } from "@/lib/metadata";
import { Photo, CTASection, SectionHeading } from "@/components/m3/primitives";
import { BlogCard } from "@/components/m3/blog-card";
export const generateStaticParams = async () =>
  (await getArticles()).map((a) => ({ slug: a.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const a = articles.find((a) => a.slug === slug);
  return a
    ? pageMetadata(a.title, a.summary, "/blog/" + a.slug, a.image)
    : { title: "Artigo não encontrado" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <article className="container article-layout">
        <header className="article-heading">
          <p className="eyebrow">
            {a.category} · <time dateTime={a.date}>{articleDate(a.date)}</time>
          </p>
          <h1>{a.title}</h1>
          <p>{a.summary}</p>
        </header>
        <div className="article-body">
          <Photo src={a.image} alt={a.title} priority />
          {a.sections.map((s, i) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {i === 1 && (
                <Photo
                  src="/reference/WyhRtolqAtg9ZPTE92NjlKjv0.webp"
                  alt="Detalhe de acabamento automotivo — imagem ilustrativa"
                />
              )}
            </section>
          ))}
          <p className="article-signature">
            M3 Auto Premium · Conteúdo editorial
          </p>
        </div>
      </article>
      <div className="section-stack">
        <CTASection />
        <section className="container">
          <SectionHeading
            eyebrow="CONTINUE EXPLORANDO"
            title="Mais ideias para sua próxima escolha."
          />
          <div className="blog-grid">
            {articles
              .filter((x) => x.slug !== a.slug)
              .map((a) => (
                <BlogCard key={a.slug} article={a} />
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
