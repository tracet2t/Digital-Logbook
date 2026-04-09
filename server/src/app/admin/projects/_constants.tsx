/**
 * _constants.tsx
 * Shared constants and types for the Projects admin page.
 * Import domain config, form defaults, and pagination settings from here
 * to avoid duplication across page components and hooks.
 */

import { Beaker, BookOpen, Cpu, Film, Globe } from "lucide-react";

/** Maps each domain key to its icon element used in tables and dialogs. */
export const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  software: <Cpu size={18} />,
  film: <Film size={18} />,
  training: <BookOpen size={18} />,
  research: <Beaker size={18} />,
  other: <Globe size={18} />,
};

/** Maps each domain key to its human-readable display label. */
export const DOMAIN_LABELS: Record<string, string> = {
  software: "Software",
  film: "Film",
  training: "Training",
  research: "Research",
  other: "Other",
};

/** Ordered list of valid domain option keys used to render Select items. */
export const DOMAIN_OPTIONS = [
  "software",
  "film",
  "training",
  "research",
  "other",
] as const;

export type DomainOption = (typeof DOMAIN_OPTIONS)[number];

/** Number of projects shown per page in the projects table. */
export const ITEMS_PER_PAGE = 10;

/** Shape of the form data used in both the Create and Edit project dialogs. */
export interface ProjectFormValues {
  name: string;
  description: string;
  domain: string;
  batchNo: string;
}

/** Default (empty) form values — used to initialise or reset the Create/Edit form. */
export const EMPTY_FORM: ProjectFormValues = {
  name: "",
  description: "",
  domain: "software",
  batchNo: "",
};
