export interface Profile {
  id: string;
  name: string;
  role: string;
  tagline: string | null;
  about: string | null;
  resume_url: string | null;
  contact_email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  problem: string | null;
  focus: string | null;
  approach_heading: string | null;
  approach_body: string | null;
  tech_tags: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  repo_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  approach_items: { heading: string; body: string }[];
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  order_index: number;
  detail_bullets: string[];
}

export interface Experience {
  id: string;
  org: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  order_index: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string | null;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  link: string | null;
  order_index: number;
}
