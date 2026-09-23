/* ImageResponse renders through Satori, which requires native img elements. */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getVehicles } from "@/data/vehicles";
import sharp from "sharp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const heroVehicle = (await getVehicles()).find(
    (v) => v.model === "HR-V" && v.year === 2023,
  )!;
  const coverImage = heroVehicle.coverImage!;
  const logo =
    "data:image/png;base64," +
    (
      await readFile(join(process.cwd(), "public/brand/m3-logo-original.png"))
    ).toString("base64");
  const car = coverImage.startsWith("/")
    ? "data:image/png;base64," +
      (
        await sharp(await readFile(join(process.cwd(), "public", coverImage)))
          .png()
          .toBuffer()
      ).toString("base64")
    : coverImage;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#151820",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "46%",
          padding: 44,
        }}
      >
        <img src={logo} alt="" width={150} height={100} />
        <div style={{ display: "flex", fontSize: 58, lineHeight: 1.08 }}>
          O próximo veículo. A sua escolha.
        </div>
        <div style={{ display: "flex", fontSize: 22 }}>
          M3 Auto Premium · Itaim Paulista
        </div>
      </div>
      <img
        src={car}
        alt=""
        style={{ width: "54%", height: "100%", objectFit: "cover" }}
      />
    </div>,
    size,
  );
}
