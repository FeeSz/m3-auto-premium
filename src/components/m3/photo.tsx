"use client";
import Image from "next/image";
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
  return (
    <div className={"photo " + className}>
      <Image
        src={failed ? "/brand/m3-logo.webp" : src}
        alt={failed ? "Fotografia indisponível. Consulte a M3." : alt}
        className={failed ? "photo-fallback" : undefined}
        fill
        sizes={sizes}
        preload={priority}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
