import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const alt = "Resona — Ease That Resonates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 55%, #FFD4B8 100%)",
          fontFamily: "sans-serif",
          color: "#3D2C23",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "linear-gradient(135deg, #FDD15E 0%, #FF8C42 60%, #FF6B4A 100%)",
            opacity: 0.35,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "linear-gradient(135deg, #FF6B4A 0%, #FF6B9D 100%)",
            opacity: 0.2,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 96px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: 10,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              marginTop: 20,
              width: 96,
              height: 6,
              borderRadius: 9999,
              background: "linear-gradient(90deg, #FDD15E 0%, #FF8C42 50%, #FF6B4A 100%)",
              display: "flex",
            }}
          />
          <div
            style={{
              marginTop: 28,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: 2,
              display: "flex",
            }}
          >
            {siteConfig.slogan}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 24,
              color: "#6B5243",
              display: "flex",
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
