import Image from "next/image";

export function Brand() {
  return (
    <span className="brand-lockup">
      <Image
        src="/brand/m3-logo.webp"
        width={500}
        height={333}
        sizes="(max-width: 809px) 72px, 82px"
        alt=""
        priority
      />
    </span>
  );
}
