import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Kaput — Find Trusted Mechanics in Vancouver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        {/* Accent glow */}
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
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.1)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 9999,
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(59, 130, 246, 0.1)",
            padding: "8px 20px",
            fontSize: 18,
            color: "#60a5fa",
            marginBottom: 24,
          }}
        >
          Now serving Vancouver, BC
        </div>

        {/* Title */}
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
              fontSize: 72,
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
              fontSize: 72,
              fontWeight: 800,
              color: "#3b82f6",
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            We&apos;ve got you.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 24,
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Find trusted mechanics. Compare transparent quotes. Book and pay online.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 32,
            color: "#64748b",
            fontSize: 18,
          }}
        >
          <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 22 }}>
            kaput.ca
          </span>
          <span>200+ Verified Mechanics</span>
          <span>4.8 Average Rating</span>
          <span>$350 Avg. Savings</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
