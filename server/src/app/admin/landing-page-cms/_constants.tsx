// ─── Types ────────────────────────────────────────────────────────────────────
export interface CmsCard {
  id: string;
  title: string;
  description: string;
  date: string; // display label shown on canvas
  rawDate: string; // ISO YYYY-MM-DD for the date picker
  isVisible: boolean;
  imageName: string | null;
  imageUrl: string | null;
  tag: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
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
    isVisible: true,
    imageName: "research_excellence_lab.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    tag: "WORKSHOP",
  },
  {
    id: "2",
    title: "The Entrepreneurial Path",
    description:
      "Navigating the complexities of archival startups and digital heritage enterprises in the modern age.",
    date: "NOVEMBER 02, 2023 • VIRTUAL",
    rawDate: "2023-11-02",
    isVisible: true,
    imageName: "startup_path.jpg",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    tag: "WEBINAR",
  },
];
