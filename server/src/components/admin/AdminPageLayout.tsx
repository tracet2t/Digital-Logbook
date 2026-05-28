interface AdminPageLayoutProps {
  children: React.ReactNode;
  /** Tailwind bg class for the page background. Defaults to bg-[#f5f7fb] */
  className?: string;
}

/**
 * Content background wrapper for admin pages.
 * The sidebar and SidebarProvider are provided by the shared admin layout.tsx.
 */
export default function AdminPageLayout({
  children,
  className = "bg-[#f5f7fb]",
}: AdminPageLayoutProps) {
  return <div className={`min-h-screen ${className}`}>{children}</div>;
}
