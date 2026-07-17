import fs from "fs";
import path from "path";
import { getBlogPosts } from "./mdx";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

export function generateRssFeed() {
  // Avoid writing to file-system in browser-side executions if this utility is imported there
  if (typeof window !== "undefined") return;

  const posts = getBlogPosts();
  const feedItems = posts
    .map((post) => {
      const url = `https://imagitech.online/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("");

  const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>†hε drεαmεr's Notebook</title>
    <link>https://imagitech.online/blog</link>
    <description>Technical articles, guides, and tutorials written by †hε drεαmεr covering Linux, networking, self-hosting, and systems security.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://imagitech.online/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "feed.xml"), feedXml.trim(), "utf-8");
}
