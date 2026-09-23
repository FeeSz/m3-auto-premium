"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const actions = [
  ["/estoque", "Ver todo o estoque"],
  ["/estoque?minYear=2025", "Ver mais novos"],
  ["/estoque?maxYear=2024", "Ver seminovos"],
] as const;

export function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 809px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const carY = useTransform(scrollYProgress, [0, 1], [0, 54]);

  return (
    <section
      ref={section}
      className="studio-hero"
      aria-labelledby="studio-title"
    >
      <motion.div
        className="studio-wordmark"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        M3 AUTO PREMIUM
      </motion.div>

      <motion.div
        className="studio-car"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ translateY: reduceMotion || isMobile ? 0 : carY }}
      >
        <div className="studio-car-shadow" aria-hidden="true" />
        <Image
          src="/images/vehicles/bmw-m5-white-m3.png"
          width={1448}
          height={1086}
          sizes="(max-width: 809px) 94vw, 62vw"
          alt="BMW M5 branca da M3 Auto Premium"
          priority
        />
      </motion.div>

      <motion.div
        className="studio-copy"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { delayChildren: 0.46, staggerChildren: 0.1 },
          },
        }}
      >
        <motion.h1
          id="studio-title"
          variants={{
            hidden: reduceMotion ? {} : { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Encontre o veículo certo para o seu momento.
        </motion.h1>
        <motion.div
          className="studio-actions"
          variants={{
            hidden: reduceMotion ? {} : { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {actions.map(([href, label]) => (
            <Link key={href} href={href} className="studio-action">
              {label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
