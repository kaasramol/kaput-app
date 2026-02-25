import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Kaput — Find Trusted Mechanics in Vancouver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.15)",
            filter: "blur(80px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            Your car is kaput?
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#3b82f6",
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            We&apos;ve got you.
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 24,
            maxWidth: 650,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Find trusted mechanics in Vancouver. Compare quotes. Book online.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontWeight: 700,
            color: "#f1f5f9",
            fontSize: 22,
          }}
        >
          kaput.ca
        </div>
      </div>
    ),
    { ...size }
  );
}
