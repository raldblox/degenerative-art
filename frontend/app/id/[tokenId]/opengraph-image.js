import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }) {
  try {
    const protocol =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://www.degeneratives.art";
    const url = `${protocol}/api/getTokenURI/${params.tokenId}`;
    const metadata = await fetch(url).then((res) => res.json());
    console.log(metadata);

    const emoji1 = decodeURIComponent(
      escape(metadata.tokenURI.attributes[0].value)
    );
    const emoji2 = decodeURIComponent(
      escape(metadata.tokenURI.attributes[1].value)
    );
    const emoji3 = decodeURIComponent(
      escape(metadata.tokenURI.attributes[2].value)
    );

    return new ImageResponse(
      (
        // ImageResponse JSX element
        <div
          style={{
            background: "black",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // Distribute rows evenly
          }}
        >
          <div style={{ display: "flex", gap: "70px", fontSize: 300 }}>
            <span>{emoji1}</span>
            <span>{emoji2}</span>
            <span>{emoji3}</span>
          </div>
          <p style={{ color: "#aaa", fontSize: 24 }}>
            degeneratives.art #{params.tokenId}
          </p>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error in Image component:", error);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          degeneratives.art
        </div>
      ),
      { ...size }
    );
  }
}
