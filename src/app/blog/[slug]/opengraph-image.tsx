import { ImageResponse } from "next/og";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/mdx";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  const title = post?.title || "Technical Guide";
  const description = post?.description || "Systems Engineering, Infrastructure & Networking";
  const date = post?.date || "2026";
  const tags = post?.tags?.slice(0, 3) || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#181818",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#F2F2F2",
          border: "8px solid #222222",
        }}
      >
        {/* Top Bar / Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #353535",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "24px",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            <span style={{ color: "#F2F2F2" }}>the-dreamer</span>
            <span style={{ color: "#A5A5A5", margin: "0 12px" }}>/</span>
            <span style={{ color: "#CF7253" }}>imagitech.online</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "18px",
              fontFamily: "monospace",
              color: "#A5A5A5",
            }}
          >
            <span>{date}</span>
          </div>
        </div>

        {/* Center Title & Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#F2F2F2",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#A5A5A5",
              lineHeight: 1.4,
              maxWidth: "1000px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Footer / Tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #353535",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
            }}
          >
            {tags.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#222222",
                  border: "1px solid #353535",
                  fontSize: "18px",
                  fontFamily: "monospace",
                  color: "#CF7253",
                }}
              >
                #{t}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontFamily: "monospace",
              color: "#85C995",
            }}
          >
            ● Verified Architecture
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
