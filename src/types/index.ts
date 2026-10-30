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
  published: boolean;
  content: string;
}

export interface Writeup {
  slug: string;
  title: string;
  description: string;
  date: string;
  platform: string;
  difficulty: string;
  points: string;
  published: boolean;
  readingTime?: string;
  content: string;
}

export interface WriteupPlatform {
  slug: string;
  name: string;
  description: string;
}
