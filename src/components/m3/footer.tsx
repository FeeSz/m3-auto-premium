import Link from "next/link";
import { CTA } from "./primitives";
import { navigation, dealership, socialLinks } from "@/lib/dealership";

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 3.8 131.9 3.8 253.9c0 44.7 11.7 88.3 33.9 126.7L2 480l102.4-33.8a220.2 220.2 0 0 0 119.4 34.1h.1c122.3 0 224.1-99.8 224.1-221.9 0-59.3-25.2-119.2-67.1-161.3ZM223.9 442.7c-37.6 0-74.4-10.1-106.4-29.2l-7.6-4.5-60.8 20 20.4-59.2-5-7.8a187.8 187.8 0 0 1-28.6-99.4c0-103.8 84.5-188.3 188.2-188.3 50.3 0 97.6 19.6 133.2 55.2a187.2 187.2 0 0 1 55.1 133.3c-.1 103.9-84.5 188.4-188.5 188.4Zm103.2-141c-5.6-2.8-33.4-16.5-38.6-18.3-5.2-1.9-9-2.8-12.8 2.8-3.7 5.6-14.6 18.3-17.9 22.1-3.3 3.7-6.6 4.2-12.2 1.4-33.3-16.7-55.2-29.8-77.2-67.5-5.8-10 5.8-9.3 16.7-30.9 1.9-3.7.9-7-.5-9.8-1.4-2.8-12.8-30.8-17.5-42.2-4.6-11.1-9.3-9.6-12.8-9.8h-10.9c-3.7 0-9.8 1.4-15 7-5.2 5.6-19.8 19.3-19.8 47.1s20.3 54.7 23.1 58.4c2.8 3.7 39.9 60.9 96.7 85.4 35.9 15.5 50 16.8 68 14.1 10.9-1.6 33.4-13.6 38.1-26.8 4.7-13.2 4.7-24.5 3.3-26.8-1.3-2.6-5.1-4-10.7-6.8Z" />
    </svg>
  );
}

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
                <a href={dealership.phoneHref}>{dealership.phone}</a>
              </p>
              <CTA href="/contato" />
            </div>
            <div className="footer-navigation">
              <nav aria-label="Navegação do rodapé">
                <Link href="/">Início</Link>
                {navigation.map(([href, label]) => (
                  <Link key={href} href={href}>
                    {label}
                  </Link>
                ))}
                <Link href="/blog">Blog</Link>
              </nav>
              <div
                className="footer-socials"
                aria-label="Redes sociais da M3 Auto Premium"
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.network}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${social.label} da M3 Auto Premium`}
                    title={social.label}
                  >
                    {social.network === "facebook" ? (
                      <FacebookIcon />
                    ) : social.network === "instagram" ? (
                      <InstagramIcon />
                    ) : (
                      <WhatsAppIcon />
                    )}
                  </a>
                ))}
              </div>
            </div>
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
