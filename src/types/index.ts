export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  tags: string[];
  readingTime?: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  github: string;
  url?: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  content: string;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  content: string;
}

export interface Writeup {
  slug: string;
  title: string;
  description: string;
  date: string;
  platform: string;
  /** Only set when the writeup lives inside a module subfolder (e.g. pwn.college) */
  module?: string;
  moduleSlug?: string;
  difficulty: string;
  points: string;
  /** Optional completion status indicator, e.g. "completed" | "in-progress" */
  status?: string;
  /** Martial arts belt attained upon path completion (e.g. "Orange Belt") */
  belt?: string;
  published: boolean;
  readingTime?: string;
  content: string;
}

export interface WriteupPlatform {
  slug: string;
  name: string;
  description: string;
  /** Whether this platform uses module subfolders instead of a flat writeup list */
  hasModules?: boolean;
}

export interface WriteupModule {
  slug: string;
  name: string;
  platform: string;
  description?: string;
  writeupCount: number;
  /** Target belt awarded upon completing the entire track, e.g. "Orange Belt" */
  belt?: string;
  /** Total number of modules required in the track (e.g. 7 for Intro to Cybersecurity) */
  totalModules?: number;
}
