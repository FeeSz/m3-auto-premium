"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Photo } from "./primitives";

export function VehicleGallery({
  images,
  name,
  className = "",
}: {
  images: string[];
  name: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStart = useRef<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );

  const show = (nextIndex: number, nextDirection: 1 | -1) => {
    if (nextIndex === index || previousIndex !== null) return;
    setPreviousIndex(index);
    setDirection(nextDirection);
    setIndex(nextIndex);
    transitionTimer.current = setTimeout(() => {
      setPreviousIndex(null);
      transitionTimer.current = null;
    }, 560);
  };

  const move = (delta: 1 | -1) =>
    show((index + delta + images.length) % images.length, delta);
  const dotStart = Math.min(
    Math.max(index - 2, 0),
    Math.max(images.length - 5, 0),
  );
  const visibleDots = Array.from(
    { length: Math.min(images.length, 5) },
    (_, offset) => dotStart + offset,
  );

  return (
    <div
      className={`vehicle-gallery ${className}`}
      role="region"
      aria-label={`Galeria de ${name}`}
      aria-roledescription="carrossel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") move(1);
        if (event.key === "ArrowLeft") move(-1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance =
          (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
        if (Math.abs(distance) > 44) move(distance < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="gallery-main">
        {previousIndex !== null && (
          <div
            className={`gallery-slide gallery-slide-previous gallery-direction-${direction > 0 ? "next" : "previous"}`}
            aria-hidden="true"
          >
            <Photo src={images[previousIndex]} alt="" />
          </div>
        )}
        <div
          key={`${images[index]}-${index}`}
          className={`gallery-slide gallery-slide-current ${previousIndex === null ? "gallery-slide-static" : `gallery-direction-${direction > 0 ? "next" : "previous"}`}`}
        >
          <Photo
            src={images[index]}
            alt={`${name} — foto ${index + 1} de ${images.length}`}
            priority={index === 0}
          />
        </div>
        <button
          className="icon-button gallery-prev"
          aria-label="Imagem anterior"
          disabled={previousIndex !== null}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
        </button>
        <button
          className="icon-button gallery-next"
          aria-label="Próxima imagem"
          disabled={previousIndex !== null}
          onClick={() => move(1)}
        >
          <ArrowRight size={18} strokeWidth={1.8} />
        </button>
        <div className="gallery-dots" aria-hidden="true">
          {visibleDots.map((dotIndex) => (
            <span key={dotIndex} data-active={index === dotIndex} />
          ))}
        </div>
      </div>
      <div className="gallery-thumbnails">
        {images.map((src, imageIndex) => (
          <button
            key={`${src}-${imageIndex}`}
            aria-label={`Ver imagem ${imageIndex + 1}`}
            aria-pressed={index === imageIndex}
            onClick={() => show(imageIndex, imageIndex > index ? 1 : -1)}
          >
            <Photo src={src} alt="" sizes="120px" />
          </button>
        ))}
      </div>
      <p className="gallery-caption" aria-live="polite">
        Imagem {index + 1} de {images.length} · Fotos do anúncio da M3
      </p>
    </div>
  );
}
