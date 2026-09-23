import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article, articleDate } from "@/lib/articles";
import { Photo } from "./primitives";
export function BlogCard({ article: a }: { article: Article }) {
  return (
    <Link className="blog-card" href={`/blog/${a.slug}`}>
      <Photo src={a.image} alt={a.title} />
      <div className="photo-shade" />
      <span className="corner-arrow" aria-hidden="true">
        <ArrowRight size={20} />
      </span>
      <div className="blog-card-copy">
        <time dateTime={a.date}>{articleDate(a.date)}</time>
        <h3>{a.title}</h3>
      </div>
    </Link>
  );
}
