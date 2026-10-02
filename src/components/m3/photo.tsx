"use client";
import Image from "next/image";
import { CameraOff } from "lucide-react";
import { useState } from "react";
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width:809px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`photo photo-unavailable ${className}`}
        role="img"
        aria-label="Fotografia indisponível. Consulte a M3."
      >
        <CameraOff size={24} strokeWidth={1.6} aria-hidden="true" />
        <span>Imagem indisponível</span>
      </div>
    );
  }
  return (
    <div className={"photo " + className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
