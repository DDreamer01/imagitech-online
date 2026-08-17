import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjects } from "@/lib/mdx";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title || "Engineering Project";
  const description = project?.description || "Systems Architecture, Infrastructure & Software";
  const techs = project?.technologies?.slice(0, 4) || [];

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
            <span style={{ color: "#CF7253" }}>projects.imagitech</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontFamily: "monospace",
              color: "#85C995",
            }}
          >
            ● Production Ready
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
              fontSize: "54px",
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

        {/* Footer / Tech Stack */}
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
            {techs.map((t) => (
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
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontFamily: "monospace",
              color: "#A5A5A5",
            }}
          >
            github.com/DDreamer01
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
