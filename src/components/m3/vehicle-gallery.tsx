"use client";
import { useRef, useState } from "react";
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
  const touchStart = useRef<number | null>(null);
  const move = (delta: number) =>
    setIndex((i) => (i + delta + images.length) % images.length);
  return (
    <div
      className={`vehicle-gallery ${className}`}
      role="region"
      aria-label={`Galeria de ${name}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") move(1);
        if (e.key === "ArrowLeft") move(-1);
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
        <Photo
          key={`${images[index]}-${index}`}
          src={images[index]}
          alt={`${name} — foto ${index + 1} de ${images.length}`}
        />
        <button
          className="icon-button gallery-prev"
          aria-label="Imagem anterior"
          onClick={() => move(-1)}
        >
          <ArrowLeft />
        </button>
        <button
          className="icon-button gallery-next"
          aria-label="Próxima imagem"
          onClick={() => move(1)}
        >
          <ArrowRight />
        </button>
      </div>
      <div className="gallery-thumbnails">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            aria-label={`Ver imagem ${i + 1}`}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <Photo src={src} alt="" sizes="120px" />
          </button>
        ))}
      </div>
      <p className="gallery-caption" aria-live="polite">
        Imagem {index + 1} de {images.length} · Fotos do anúncio da M3
      </p>
      <div className="gallery-dots" aria-hidden="true">
        {images.map((_, dotIndex) => (
          <span key={dotIndex} data-active={index === dotIndex} />
        ))}
      </div>
    </div>
  );
}
