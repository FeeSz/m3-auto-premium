import Link from "next/link";
import { CTA } from "./primitives";
import { navigation, dealership } from "@/lib/dealership";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-panel">
        <div className="container">
          <div className="footer-top">
            <div>
              <h2>Pronto para o próximo veículo?</h2>
              <p>
                {dealership.address}
                <br />
                <a href={dealership.phoneHref}>{dealership.phone}</a> ·{" "}
                <a href={dealership.instagram} target="_blank" rel="noreferrer">
                  Instagram ↗
                </a>
              </p>
              <CTA href="/contato" />
            </div>
            <nav aria-label="Navegação do rodapé">
              <Link href="/">Início</Link>
              {navigation.map(([href, label]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
              <Link href="/blog">Blog</Link>
            </nav>
          </div>
          <div className="footer-wordmark" aria-label="M3 Auto Premium">
            M3 AUTO PREMIUM
          </div>
          <div className="footer-bottom">
            <small>
              © {new Date().getFullYear()} {dealership.name}
            </small>
            <div>
              <Link href="/termos">Termos de uso</Link>
              <span>|</span>
              <Link href="/privacidade">Privacidade</Link>
              <span>|</span>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
