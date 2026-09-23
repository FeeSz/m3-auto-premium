"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { whatsappUrl } from "@/lib/dealership";

const slides = [
  {
    eyebrow: "EXPERIÊNCIA M3",
    title: "Pronto para sentir o seu próximo veículo?",
    copy: "Agende um test drive particular e conheça cada detalhe antes de decidir.",
    label: "Agendar test drive",
    href: whatsappUrl(
      "Olá! Gostaria de agendar um test drive na M3 Auto Premium.",
    ),
    external: true,
    image: "/images/bmw-m5-test-drive-banner.png",
    alt: "BMW M5 branca em movimento durante um test drive",
    variant: "test-drive",
  },
  {
    eyebrow: "FINANCIAMENTO M3",
    title: "Seu próximo veículo, na condição certa.",
    copy: "Condições sob medida, com atendimento direto da equipe M3.",
    label: "Simular agora",
    href: "/financiamento",
    external: false,
    image: "/images/bmw-m5-financing-pexels.jpg",
    alt: "BMW M5 branca fotografada em um ambiente automotivo interno",
    variant: "financing",
  },
] as const;

const ROTATION_INTERVAL = 6000;

export function ExperienceCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const select = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (paused || reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="test-drive-card experience-carousel"
      data-paused={paused ? "true" : "false"}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Experiências e soluções M3"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") select(active - 1);
        if (event.key === "ArrowRight") select(active + 1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start == null || end == null) return;
        if (Math.abs(start - end) > 42) select(active + (start > end ? 1 : -1));
        window.setTimeout(() => setPaused(false), 1200);
      }}
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        return (
          <article
            className={`experience-slide experience-slide--${slide.variant}${isActive ? " is-active" : ""}`}
            aria-hidden={!isActive}
            key={slide.variant}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 809px) calc(100vw - 40px), 1200px"
            />
            <div className="test-drive-content">
              <p className="eyebrow">{slide.eyebrow}</p>
              <h2>{slide.title}</h2>
              <p>{slide.copy}</p>
              <Link
                href={slide.href}
                target={slide.external ? "_blank" : undefined}
                rel={slide.external ? "noopener noreferrer" : undefined}
                tabIndex={isActive ? 0 : -1}
              >
                {slide.label}
                <span aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </div>
          </article>
        );
      })}

      <div className="experience-pagination" aria-label="Selecionar destaque">
        {slides.map((slide, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            aria-label={`Exibir ${slide.eyebrow.toLocaleLowerCase("pt-BR")}`}
            aria-pressed={index === active}
            onClick={() => select(index)}
            key={slide.variant}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
