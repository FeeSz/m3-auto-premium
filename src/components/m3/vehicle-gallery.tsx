"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { Photo } from "./primitives";

const TRANSITION_MS = 520;

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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const viewer = useRef<HTMLDivElement | null>(null);
  const viewerOpener = useRef<HTMLElement | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!isViewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const handleViewerKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsViewerOpen(false);
        setViewerIndex(null);
        return;
      }
      if (event.key === "Tab") {
        const controls = viewer.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleViewerKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleViewerKeyboard);
      viewerOpener.current?.focus();
    };
  }, [isViewerOpen]);

  const openViewer = (trigger: HTMLElement) => {
    viewerOpener.current = trigger;
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const openViewerAt = (nextIndex: number, trigger: HTMLElement) => {
    viewerOpener.current = trigger;
    setViewerIndex(nextIndex);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewerIndex(null);
  };

  const moveViewer = (delta: 1 | -1) => {
    setViewerIndex(
      (currentIndex) =>
        ((currentIndex ?? index) + delta + images.length) % images.length,
    );
  };

  const show = (nextIndex: number, nextDirection: 1 | -1) => {
    if (nextIndex === index || previousIndex !== null) return;
    setPreviousIndex(index);
    setDirection(nextDirection);
    setIndex(nextIndex);
    transitionTimer.current = setTimeout(() => {
      setPreviousIndex(null);
      transitionTimer.current = null;
    }, TRANSITION_MS);
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
  const previousPreview = (index - 1 + images.length) % images.length;
  const nextPreview = (index + 1) % images.length;

  return (
    <div
      className={`vehicle-gallery ${className}`}
      role="region"
      aria-label={`Galeria de ${name}`}
      aria-roledescription="carrossel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (isViewerOpen) return;
        if (event.key === "ArrowRight") move(1);
        if (event.key === "ArrowLeft") move(-1);
      }}
      onTouchStart={(event) => {
        didSwipe.current = false;
        touchStart.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance =
          (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
        if (Math.abs(distance) > 44) {
          didSwipe.current = true;
          move(distance < 0 ? 1 : -1);
        }
        touchStart.current = null;
      }}
    >
      <div className="gallery-main">
        <div
          key={`panorama-${index}`}
          className={`gallery-panorama gallery-panorama-${direction > 0 ? "next" : "previous"}`}
        >
          <button
            aria-label={`Ampliar foto ${previousPreview + 1} de ${images.length}`}
            onClick={(event) =>
              openViewerAt(previousPreview, event.currentTarget)
            }
          >
            <Photo src={images[previousPreview]} alt="" />
          </button>
          <button
            className="gallery-panorama-current"
            aria-label={`Ampliar foto ${index + 1} de ${images.length}`}
            onClick={(event) => openViewer(event.currentTarget)}
          >
            <Photo
              src={images[index]}
              alt={`${name} — foto ${index + 1} de ${images.length}`}
              priority={index === 0}
            />
            <span className="gallery-expand-hint" aria-hidden="true">
              <Expand size={17} /> Ver foto completa
            </span>
          </button>
          <button
            aria-label={`Ampliar foto ${nextPreview + 1} de ${images.length}`}
            onClick={(event) => openViewerAt(nextPreview, event.currentTarget)}
          >
            <Photo src={images[nextPreview]} alt="" />
          </button>
        </div>

        <div
          className="gallery-mobile-stage"
          role="button"
          tabIndex={0}
          aria-label={`Ampliar foto ${index + 1} de ${images.length}`}
          onClick={(event) => {
            if (!didSwipe.current) openViewer(event.currentTarget);
            didSwipe.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openViewer(event.currentTarget);
            }
          }}
        >
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

      {isViewerOpen && (
        <div
          ref={viewer}
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <div className="gallery-viewer-frame">
            <div className="gallery-viewer-toolbar">
              <p>
                <strong>{name}</strong>
                <span>
                  {(viewerIndex ?? index) + 1} / {images.length}
                </span>
              </p>
              <button
                ref={closeButton}
                type="button"
                aria-label="Fechar foto ampliada"
                onClick={closeViewer}
              >
                <X size={22} />
              </button>
            </div>
            <div className="gallery-viewer-image">
              <Photo
                key={images[viewerIndex ?? index]}
                src={images[viewerIndex ?? index]}
                alt={`${name} — foto ampliada ${(viewerIndex ?? index) + 1} de ${images.length}`}
                priority
              />
              <button
                className="gallery-viewer-prev"
                type="button"
                aria-label="Foto anterior"
                onClick={() => moveViewer(-1)}
              >
                <ArrowLeft size={22} />
              </button>
              <button
                className="gallery-viewer-next"
                type="button"
                aria-label="Próxima foto"
                onClick={() => moveViewer(1)}
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
