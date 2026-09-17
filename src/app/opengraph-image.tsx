import { ImageResponse } from "next/og";

export const alt = "Ahmed Kabeer — Application Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#050505",
          color: "#f5f5f5",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#baff29",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
          }}
        >
          Application Developer
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, display: "flex", lineHeight: 1.05 }}>
          Ahmed Kabeer
        </div>
        <div style={{ fontSize: 30, color: "#8a8a8a", marginTop: 28, display: "flex", maxWidth: 900 }}>
          I build systems that don&apos;t just work — they scale, adapt, and perform.
        </div>
      </div>
    ),
    { ...size }
  );
}
