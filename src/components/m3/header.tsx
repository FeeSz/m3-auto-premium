"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { navigation, dealership, mapsUrl } from "@/lib/dealership";
import { Brand } from "./brand";
import { CTA } from "./primitives";
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = panel.current?.querySelectorAll<HTMLElement>("a,button");
    links?.[0]?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab" && links?.length) {
        const first = links[0],
          last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          button.current?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          button.current?.focus();
        } else if (document.activeElement === button.current) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handler);
    };
  }, [open]);
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className={`header-inner container ${open ? "is-open" : ""}`}>
        <div className="header-main-row">
        <Link
          href="/"
          className="wordmark"
          onClick={() => setOpen(false)}
          aria-label="M3 Auto Premium — início"
        >
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map(([href, label]) => (
            <Link
              href={href}
              key={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-cta">
          <a className="header-phone" href={dealership.phoneHref}>
            {dealership.phone}
          </a>
          <CTA href="/contato">Fale conosco</CTA>
        </div>
        <button
          ref={button}
          className="icon-button menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        </div>
        <div
          ref={panel}
          id="mobile-nav"
          className="mobile-panel"
          aria-hidden={!open}
          inert={!open ? true : undefined}
        >
          <nav aria-label="Navegação mobile">
            {navigation.map(([href, label]) => (
              <Link
                href={href}
                key={href}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="contact-icons">
            <a
              className="icon-button"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver endereço no Google Maps"
            >
              <MapPin size={19} />
            </a>
            <a
              className="icon-button"
              href={dealership.phoneHref}
              aria-label="Ligar para a M3"
            >
              <Phone size={19} />
            </a>
          </div>
          <span onClick={() => setOpen(false)}>
            <CTA href="/contato" />
          </span>
        </div>
      </div>
    </header>
  );
}
