// ─── Types ────────────────────────────────────────────────────────────────────
export interface ArticleImageItem {
  id: string;
  url: string;
  key: string;
  order: number;
}

export interface CoverImage {
  id: string;
  url: string;
  key: string;
}

export interface CmsCard {
  id: string;
  title: string;
  description: string;
  date: string; // display label shown on canvas
  rawDate: string; // ISO YYYY-MM-DD for the date picker
  rawTime: string; // HH:MM for the time picker
  isVisible: boolean;
  coverImage: CoverImage | null;
  images: ArticleImageItem[];
  tag: string;
  registerLink: string; // URL for the register button
  venue: string;
  venueMapLink: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function formatDisplayDate(iso: string, time?: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  const datePart = d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
  return time ? `${datePart} • ${time}` : datePart;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
export const DEFAULT_CARDS: CmsCard[] = [
  {
    id: "1",
    title: "Research Excellence Workshop",
    description:
      "Explore the latest advancements in archival methodologies and data curation strategies for large-scale institutional repositories.",
    date: "SAT, 7 MAR AT 09:30",
    rawDate: "2026-03-07",
    rawTime: "09:30",
    isVisible: true,
    coverImage: {
      id: "seed-cover-1",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      key: "seed/research_excellence_lab.jpg",
    },
    images: [],
    tag: "WORKSHOP",
    registerLink: "",
    venue: "",
    venueMapLink: "",
  },
  {
    id: "2",
    title: "The Entrepreneurial Path",
    description:
      "Navigating the complexities of archival startups and digital heritage enterprises in the modern age.",
    date: "NOVEMBER 02, 2023 • VIRTUAL",
    rawDate: "2023-11-02",
    rawTime: "",
    isVisible: true,
    coverImage: {
      id: "seed-cover-2",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
      key: "seed/startup_path.jpg",
    },
    images: [],
    tag: "WEBINAR",
    registerLink: "",
    venue: "",
    venueMapLink: "",
  },
];
