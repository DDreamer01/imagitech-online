import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, Project, Note } from "../types";

const CONTENT_PATH = path.join(process.cwd(), "content");

// Helper to calculate reading time
function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s+/).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

// Ensure content directories exist
function ensureDirectories() {
  const dirs = [
    path.join(CONTENT_PATH, "blog"),
    path.join(CONTENT_PATH, "projects"),
    path.join(CONTENT_PATH, "notes"),
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// --- BLOG POSTS ---

export function getBlogPosts(): BlogPost[] {
  ensureDirectories();
  const blogDir = path.join(CONTENT_PATH, "blog");
  const files = fs.readdirSync(blogDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const slug = file.replace(/\.mdx?$/, "");

      return {
        slug,
        title: data.title || "Untitled Post",
        description: data.description || "",
        date: data.date || new Date().toISOString().split("T")[0],
        published: data.published !== false,
        tags: data.tags || [],
        readingTime: getReadingTime(content),
        content,
      } as BlogPost;
    })
    .filter((post) => post.published);

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  ensureDirectories();
  const blogDir = path.join(CONTENT_PATH, "blog");
  const mdxPath = path.join(blogDir, `${slug}.mdx`);
  const mdPath = path.join(blogDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled Post",
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
    published: data.published !== false,
    tags: data.tags || [],
    readingTime: getReadingTime(content),
    content,
  } as BlogPost;
}

// --- PROJECTS ---

export function getProjects(): Project[] {
  ensureDirectories();
  const projectsDir = path.join(CONTENT_PATH, "projects");
  const files = fs.readdirSync(projectsDir);

  const projects = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(projectsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const slug = file.replace(/\.mdx?$/, "");

      return {
        slug,
        title: data.title || "Untitled Project",
        description: data.description || "",
        date: data.date || new Date().toISOString().split("T")[0],
        github: data.github || "",
        url: data.url,
        technologies: data.technologies || [],
        featured: data.featured === true,
        published: data.published !== false,
        content,
      } as Project;
    })
    .filter((project) => project.published);

  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string): Project | null {
  ensureDirectories();
  const projectsDir = path.join(CONTENT_PATH, "projects");
  const mdxPath = path.join(projectsDir, `${slug}.mdx`);
  const mdPath = path.join(projectsDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled Project",
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
    github: data.github || "",
    url: data.url,
    technologies: data.technologies || [],
    featured: data.featured === true,
    published: data.published !== false,
    content,
  } as Project;
}

// --- NOTES ---

export function getNotes(): Note[] {
  ensureDirectories();
  const notesDir = path.join(CONTENT_PATH, "notes");
  const files = fs.readdirSync(notesDir);

  const notes = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(notesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const slug = file.replace(/\.mdx?$/, "");

      return {
        slug,
        title: data.title || "Untitled Note",
        date: data.date || new Date().toISOString().split("T")[0],
        category: data.category || "General",
        published: data.published !== false,
        content,
      } as Note;
    })
    .filter((note) => note.published);

  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteBySlug(slug: string): Note | null {
  ensureDirectories();
  const notesDir = path.join(CONTENT_PATH, "notes");
  const mdxPath = path.join(notesDir, `${slug}.mdx`);
  const mdPath = path.join(notesDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled Note",
    date: data.date || new Date().toISOString().split("T")[0],
    category: data.category || "General",
    published: data.published !== false,
    content,
  } as Note;
}

// --- TABLE OF CONTENTS UTILITIES ---

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/ /g, "-");
}

export function extractHeadings(markdownText: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    const depth = match[1].length; // 2 for h2, 3 for h3
    const text = match[2].trim();
    const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1");
    const id = textToSlug(cleanText);
    
    headings.push({ id, text: cleanText, depth });
  }

  return headings;
}
