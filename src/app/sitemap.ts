import { MetadataRoute } from "next";
import { getBlogPosts, getProjects, getNotes, getWriteups, WRITEUP_PLATFORMS } from "@/lib/mdx";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://imagitech.online";

  // Static pages
  const staticPaths = ["", "/about", "/uses", "/now", "/contact", "/blog", "/projects", "/notes", "/writeups"];
  const staticMaps = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Blog Posts
  const blogPosts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic Projects
  const projects = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic Notes
  const notes = getNotes().map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Writeup platforms
  const writeupPlatforms = WRITEUP_PLATFORMS.map((platform) => ({
    url: `${baseUrl}/writeups/${platform.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic Writeups
  const writeups = getWriteups().map((writeup) => ({
    url: `${baseUrl}/writeups/${writeup.platform}/${writeup.slug}`,
    lastModified: new Date(writeup.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticMaps, ...blogPosts, ...projects, ...notes, ...writeupPlatforms, ...writeups];
}
