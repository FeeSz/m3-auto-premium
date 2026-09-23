import { PageHero, CTASection } from "@/components/m3/primitives";
import { BlogCard } from "@/components/m3/blog-card";
import { getArticles } from "@/lib/articles";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Blog",
  "Guias e histórias sobre escolha, troca e experiência automotiva no blog da M3 Auto Premium.",
  "/blog",
);
export default async function Page() {
  const articles = await getArticles();
  return (
    <>
      <PageHero
        title="Ideias, detalhes e histórias sobre o seu próximo veículo."
        description="Conteúdo para conhecer melhor cada escolha. Explore os guias da M3 e encontre respostas para seguir em frente."
        href="/sobre"
        cta="Sobre a M3"
      />
      <div className="section-stack">
        <section className="container blog-grid" aria-label="Artigos">
          {articles.map((a) => (
            <BlogCard key={a.slug} article={a} />
          ))}
        </section>
        <CTASection />
      </div>
    </>
  );
}
