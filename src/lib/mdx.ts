import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { BlogPost, Project, Note, Writeup, WriteupPlatform, WriteupModule } from "../types";

const CONTENT_PATH = path.join(process.cwd(), "content");

// --- ZOD SCHEMAS FOR STRICT RUNTIME VALIDATION ---

export const BlogPostFrontmatterSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  description: z.string().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  published: z.boolean().default(true),
  tags: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return val;
  }, z.array(z.string()).default([])),
});

export const ProjectFrontmatterSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  github: z.string().default(""),
  url: z.string().optional(),
  technologies: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return val;
  }, z.array(z.string()).default([])),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const NoteFrontmatterSchema = z.object({
  title: z.string().min(1, "Note title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  category: z.string().default("General"),
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return val.split(",").map((t) => t.trim()).filter(Boolean);
    return [];
  }, z.array(z.string())).default([]),
  published: z.boolean().default(true),
});

export const WriteupFrontmatterSchema = z.object({
  title: z.string().min(1, "Writeup title is required"),
  description: z.string().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  difficulty: z.string().default(""),
  points: z.string().default(""),
  /** Human-readable module name — e.g. "Intro to Cybersecurity" (pwn.college only) */
  module: z.string().optional(),
  /** Completion status: "completed" | "in-progress" */
  status: z.string().optional(),
  /** Martial arts belt attained upon completing this track (e.g. "Orange Belt") */
  belt: z.string().optional(),
  published: z.boolean().default(true),
});

// Helper to calculate reading time
function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s+/).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper to parse MDX frontmatter safely, handling typos like `--` instead of `---` at file start
export function parseMdxMatter(fileContent: string) {
  const normalized = fileContent.replace(/^--[ \t]*(\r?\n)/, "---$1");
  return matter(normalized);
}

// Ensure content directories exist
function ensureDirectories() {
  const dirs = [
    path.join(CONTENT_PATH, "blog"),
    path.join(CONTENT_PATH, "projects"),
    path.join(CONTENT_PATH, "notes"),
    path.join(CONTENT_PATH, "writeups"),
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

      try {
        const validated = BlogPostFrontmatterSchema.parse(data);
        return {
          slug,
          ...validated,
          readingTime: getReadingTime(content),
          content,
        } as BlogPost;
      } catch (err) {
        console.error(`\x1b[31m[Zod Error] Invalid frontmatter in ${file}:\x1b[0m`, err);
        return {
          slug,
          title: (data.title as string) || "Untitled Post",
          description: (data.description as string) || "",
          date: (data.date as string) || new Date().toISOString().split("T")[0],
          published: data.published !== false,
          tags: Array.isArray(data.tags) ? data.tags : [],
          readingTime: getReadingTime(content),
          content,
        } as BlogPost;
      }
    })
    .filter((post) => post.published);

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
  const { data, content } = parseMdxMatter(fileContent);

  try {
    const validated = BlogPostFrontmatterSchema.parse(data);
    return {
      slug,
      ...validated,
      readingTime: getReadingTime(content),
      content,
    } as BlogPost;
  } catch (err) {
    console.error(`\x1b[31m[Zod Error] Invalid frontmatter in ${slug}:\x1b[0m`, err);
    return {
      slug,
      title: (data.title as string) || "Untitled Post",
      description: (data.description as string) || "",
      date: (data.date as string) || new Date().toISOString().split("T")[0],
      published: data.published !== false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime: getReadingTime(content),
      content,
    } as BlogPost;
  }
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

      try {
        const validated = ProjectFrontmatterSchema.parse(data);
        return {
          slug,
          ...validated,
          content,
        } as Project;
      } catch (err) {
        console.error(`\x1b[31m[Zod Error] Invalid project frontmatter in ${file}:\x1b[0m`, err);
        return {
          slug,
          title: (data.title as string) || "Untitled Project",
          description: (data.description as string) || "",
          date: (data.date as string) || new Date().toISOString().split("T")[0],
          github: (data.github as string) || "",
          url: data.url as string | undefined,
          technologies: Array.isArray(data.technologies) ? data.technologies : [],
          featured: data.featured === true,
          published: data.published !== false,
          content,
        } as Project;
      }
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
  const { data, content } = parseMdxMatter(fileContent);

  try {
    const validated = ProjectFrontmatterSchema.parse(data);
    return {
      slug,
      ...validated,
      content,
    } as Project;
  } catch (err) {
    console.error(`\x1b[31m[Zod Error] Invalid project frontmatter in ${slug}:\x1b[0m`, err);
    return {
      slug,
      title: (data.title as string) || "Untitled Project",
      description: (data.description as string) || "",
      date: (data.date as string) || new Date().toISOString().split("T")[0],
      github: (data.github as string) || "",
      url: data.url as string | undefined,
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      featured: data.featured === true,
      published: data.published !== false,
      content,
    } as Project;
  }
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

      try {
        const validated = NoteFrontmatterSchema.parse(data);
        return {
          slug,
          ...validated,
          content,
        } as Note;
      } catch (err) {
        console.error(`\x1b[31m[Zod Error] Invalid note frontmatter in ${file}:\x1b[0m`, err);
        return {
          slug,
          title: (data.title as string) || "Untitled Note",
          date: (data.date as string) || new Date().toISOString().split("T")[0],
          category: (data.category as string) || "General",
          tags: Array.isArray(data.tags) ? data.tags : [],
          published: data.published !== false,
          content,
        } as Note;
      }
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
  const { data, content } = parseMdxMatter(fileContent);

  try {
    const validated = NoteFrontmatterSchema.parse(data);
    return {
      slug,
      ...validated,
      content,
    } as Note;
  } catch (err) {
    console.error(`\x1b[31m[Zod Error] Invalid note frontmatter in ${slug}:\x1b[0m`, err);
    return {
      slug,
      title: (data.title as string) || "Untitled Note",
      date: (data.date as string) || new Date().toISOString().split("T")[0],
      category: (data.category as string) || "General",
      tags: Array.isArray(data.tags) ? data.tags : [],
      published: data.published !== false,
      content,
    } as Note;
  }
}

// --- WRITEUPS ---

// Platform registry: the URL slug maps to a themed display name
export const WRITEUP_PLATFORMS: WriteupPlatform[] = [
  {
    slug: "pwn-college",
    name: "pwn.college",
    description:
      "Cybersecurity writeups from pwn.college — working through modules in Intro to Cybersecurity and beyond.",
    hasModules: true,
  },
  {
    slug: "hackthebox",
    name: "HackTheBox",
    description:
      "HTB machine walk-throughs — recon, enumeration, foothold, and privilege escalation notes across retired boxes.",
  },
  {
    slug: "portswigger",
    name: "PortSwigger",
    description:
      "Burp Suite lab solutions from the Web Security Academy, one vulnerability class at a time.",
  },
];

export function getWriteupPlatform(platformSlug: string): WriteupPlatform | null {
  return WRITEUP_PLATFORMS.find((platform) => platform.slug === platformSlug) ?? null;
}

interface ValidatedWriteup {
  slug: string;
  platform: string;
  /** Module folder slug — only set for platforms with hasModules: true */
  moduleSlug?: string;
  validated: {
    title: string;
    description: string;
    date: string;
    difficulty: string;
    points: string;
    module?: string;
    status?: string;
    belt?: string;
    published: boolean;
  };
  content: string;
}

function mapWriteup(writeup: ValidatedWriteup): Writeup {
  return {
    slug: writeup.slug,
    platform: writeup.platform,
    moduleSlug: writeup.moduleSlug,
    ...writeup.validated,
    readingTime: getReadingTime(writeup.content),
    content: writeup.content,
  };
}

// ----------------------------------------------------------------
// MODULE HELPERS (pwn.college-style: platform → module → writeup)
// ----------------------------------------------------------------

/** Metadata for known coursework tracks (e.g. pwn.college belt dojos or collections) */
const TRACK_METADATA: Record<
  string,
  { name?: string; belt?: string; totalModules?: number; description?: string }
> = {
  "intro-to-cybersecurity": {
    name: "Intro to Cybersecurity",
    belt: "Orange Belt",
    totalModules: 7,
    description:
      "7 core modules covering web security, network protocols, cryptography, access control, reverse engineering, binary exploitation, and integrated security toward the pwn.college Orange Belt.",
  },
  "dsu-cyber-camp": {
    name: "DSU Cyber Camps",
    description:
      "Challenges and modules from the Dakota State University Cyber Camp dojo on pwn.college.",
  },
  "dsu-cyber-camps": {
    name: "DSU Cyber Camps",
    description:
      "Challenges and modules from the Dakota State University Cyber Camp dojo on pwn.college.",
  },
};

/**
 * Returns metadata for every module subfolder inside a platform that has
 * `hasModules: true`. Each entry carries the folder slug, a human-readable
 * name derived from the folder name, and a writeup count.
 * Supports optional `_meta.json` inside module folders for custom names/descriptions.
 */
export function getWriteupModules(platformSlug: string): WriteupModule[] {
  const platform = getWriteupPlatform(platformSlug);
  if (!platform?.hasModules) return [];

  const platformDir = path.join(CONTENT_PATH, "writeups", platformSlug);
  if (!fs.existsSync(platformDir)) return [];

  return fs
    .readdirSync(platformDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const moduleDir = path.join(platformDir, entry.name);
      const writeupCount = fs
        .readdirSync(moduleDir)
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md")).length;

      // Check for optional _meta.json file inside the folder
      let fileMeta: {
        name?: string;
        description?: string;
        belt?: string;
        totalModules?: number;
      } = {};
      const metaPath = path.join(moduleDir, "_meta.json");
      if (fs.existsSync(metaPath)) {
        try {
          fileMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        } catch (e) {
          console.error(`Invalid _meta.json in ${moduleDir}:`, e);
        }
      }

      const trackMeta = TRACK_METADATA[entry.name];
      const name =
        fileMeta.name ||
        trackMeta?.name ||
        entry.name
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      return {
        slug: entry.name,
        name,
        platform: platformSlug,
        writeupCount,
        belt: fileMeta.belt ?? trackMeta?.belt,
        totalModules: fileMeta.totalModules ?? trackMeta?.totalModules,
        description: fileMeta.description ?? trackMeta?.description,
      } satisfies WriteupModule;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Returns all published writeups inside a specific module subfolder.
 */
export function getWriteupsByModule(platformSlug: string, moduleSlug: string): Writeup[] {
  const platform = getWriteupPlatform(platformSlug);
  if (!platform?.hasModules) return [];

  const moduleDir = path.join(CONTENT_PATH, "writeups", platformSlug, moduleSlug);
  if (!fs.existsSync(moduleDir)) return [];

  return fs
    .readdirSync(moduleDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fileContent = fs.readFileSync(path.join(moduleDir, file), "utf-8");
      const { data, content } = parseMdxMatter(fileContent);

      try {
        const validated = WriteupFrontmatterSchema.parse(data);
        return mapWriteup({ slug, platform: platformSlug, moduleSlug, validated, content });
      } catch (err) {
        console.error(
          `\x1b[31m[Zod Error] Invalid writeup frontmatter in ${platformSlug}/${moduleSlug}/${slug}:\x1b[0m`,
          err
        );
        return mapWriteup({
          slug,
          platform: platformSlug,
          moduleSlug,
          validated: {
            title: (data.title as string) || "Untitled Writeup",
            description: (data.description as string) || "",
            date: (data.date as string) || new Date().toISOString().split("T")[0],
            difficulty: (data.difficulty as string) || "",
            points: (data.points as string) || "",
            module: (data.module as string) || undefined,
            status: (data.status as string) || undefined,
            belt: (data.belt as string) || undefined,
            published: data.published !== false,
          },
          content,
        });
      }
    })
    .filter((w) => w.published)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Returns a single writeup from inside a module subfolder.
 */
export function getWriteupByModuleAndSlug(
  platformSlug: string,
  moduleSlug: string,
  slug: string
): Writeup | null {
  const platform = getWriteupPlatform(platformSlug);
  if (!platform?.hasModules) return null;

  const moduleDir = path.join(CONTENT_PATH, "writeups", platformSlug, moduleSlug);
  const mdxPath = path.join(moduleDir, `${slug}.mdx`);
  const mdPath = path.join(moduleDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMdxMatter(fileContent);

  try {
    const validated = WriteupFrontmatterSchema.parse(data);
    return mapWriteup({ slug, platform: platformSlug, moduleSlug, validated, content });
  } catch (err) {
    console.error(
      `\x1b[31m[Zod Error] Invalid writeup frontmatter in ${platformSlug}/${moduleSlug}/${slug}:\x1b[0m`,
      err
    );
    return mapWriteup({
      slug,
      platform: platformSlug,
      moduleSlug,
      validated: {
        title: (data.title as string) || "Untitled Writeup",
        description: (data.description as string) || "",
        date: (data.date as string) || new Date().toISOString().split("T")[0],
        difficulty: (data.difficulty as string) || "",
        points: (data.points as string) || "",
        module: (data.module as string) || undefined,
        status: (data.status as string) || undefined,
        belt: (data.belt as string) || undefined,
        published: data.published !== false,
      },
      content,
    });
  }
}

export function getWriteups(platformSlug?: string): Writeup[] {
  ensureDirectories();
  const writeupsBaseDir = path.join(CONTENT_PATH, "writeups");

  let platformDirs: string[] = [];
  try {
    platformDirs = fs
      .readdirSync(writeupsBaseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (err) {
    console.error(`\x1b[31m[Content Error] Cannot read writeups directory:\x1b[0m`, err);
    return [];
  }

  if (platformSlug) {
    if (!getWriteupPlatform(platformSlug)) {
      console.error(`\x1b[31m[Content Error] Unknown writeup platform: ${platformSlug}\x1b[0m`);
      return [];
    }
    platformDirs = platformDirs.filter((dir) => dir === platformSlug);
  }

  const writeups = platformDirs.flatMap((platformDir) => {
    const platform = getWriteupPlatform(platformDir);
    const dirPath = path.join(writeupsBaseDir, platformDir);
    if (!fs.existsSync(dirPath)) return [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // --- Flat files at the platform root (HackTheBox, PortSwigger style) ---
    const flatFiles = entries
      .filter((e) => e.isFile() && (e.name.endsWith(".mdx") || e.name.endsWith(".md")))
      .map((e) => {
        const slug = e.name.replace(/\.mdx?$/, "");
        const fileContent = fs.readFileSync(path.join(dirPath, e.name), "utf-8");
        const { data, content } = parseMdxMatter(fileContent);
        try {
          const validated = WriteupFrontmatterSchema.parse(data);
          return mapWriteup({ slug, platform: platformDir, validated, content });
        } catch (err) {
          console.error(
            `\x1b[31m[Zod Error] Invalid writeup frontmatter in ${platformDir}/${slug}:\x1b[0m`,
            err
          );
          return mapWriteup({
            slug,
            platform: platformDir,
            validated: {
              title: (data.title as string) || "Untitled Writeup",
              description: (data.description as string) || "",
              date: (data.date as string) || new Date().toISOString().split("T")[0],
              difficulty: (data.difficulty as string) || "",
              points: (data.points as string) || "",
              published: data.published !== false,
            },
            content,
          });
        }
      });

    // --- Module subfolders (pwn.college style) ---
    const moduleWriteups = platform?.hasModules
      ? entries
          .filter((e) => e.isDirectory())
          .flatMap((moduleEntry) => {
            const moduleDir = path.join(dirPath, moduleEntry.name);
            return fs
              .readdirSync(moduleDir)
              .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
              .map((file) => {
                const slug = file.replace(/\.mdx?$/, "");
                const fileContent = fs.readFileSync(path.join(moduleDir, file), "utf-8");
                const { data, content } = parseMdxMatter(fileContent);
                try {
                  const validated = WriteupFrontmatterSchema.parse(data);
                  return mapWriteup({
                    slug,
                    platform: platformDir,
                    moduleSlug: moduleEntry.name,
                    validated,
                    content,
                  });
                } catch {
                  return mapWriteup({
                    slug,
                    platform: platformDir,
                    moduleSlug: moduleEntry.name,
                    validated: {
                      title: (data.title as string) || "Untitled Writeup",
                      description: (data.description as string) || "",
                      date: (data.date as string) || new Date().toISOString().split("T")[0],
                      difficulty: (data.difficulty as string) || "",
                      points: (data.points as string) || "",
                      module: (data.module as string) || undefined,
                      status: (data.status as string) || undefined,
                      belt: (data.belt as string) || undefined,
                      published: data.published !== false,
                    },
                    content,
                  });
                }
              });
          })
      : [];

    return [...flatFiles, ...moduleWriteups];
  });

  return writeups
    .filter((writeup) => writeup.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug));
}

export function getWriteupBySlug(platformSlug: string, slug: string): Writeup | null {
  const platformDir = path.join(CONTENT_PATH, "writeups", platformSlug);
  if (!getWriteupPlatform(platformSlug) || !fs.existsSync(platformDir)) return null;

  const mdxPath = path.join(platformDir, `${slug}.mdx`);
  const mdPath = path.join(platformDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMdxMatter(fileContent);

  try {
    const validated = WriteupFrontmatterSchema.parse(data);
    return mapWriteup({ slug, platform: platformSlug, validated, content });
  } catch (err) {
    console.error(
      `\x1b[31m[Zod Error] Invalid writeup frontmatter in ${platformSlug}/${slug}:\x1b[0m`,
      err
    );
    return mapWriteup({
      slug,
      platform: platformSlug,
      validated: {
        title: (data.title as string) || "Untitled Writeup",
        description: (data.description as string) || "",
        date: (data.date as string) || new Date().toISOString().split("T")[0],
        difficulty: (data.difficulty as string) || "",
        points: (data.points as string) || "",
        published: data.published !== false,
      },
      content,
    });
  }
}

// --- TAGS MATRIX HELPER ---

export interface TagCount {
  name: string;
  count: number;
}

export function getAllTags(): TagCount[] {
  const posts = getBlogPosts();
  const tagMap: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalized = tag.trim();
      if (normalized) {
        tagMap[normalized] = (tagMap[normalized] || 0) + 1;
      }
    });
  });

  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByTag(tagName: string): BlogPost[] {
  const posts = getBlogPosts();
  const normalizedTarget = decodeURIComponent(tagName).toLowerCase().trim();

  return posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().trim() === normalizedTarget)
  );
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
