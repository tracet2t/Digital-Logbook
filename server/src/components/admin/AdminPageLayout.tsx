"use client";

import AsideSidebar from "@/components/AsideSidebar";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  /** Tailwind bg class for the page background. Defaults to bg-[#f5f7fb] */
  className?: string;
}

/**
 * Shared layout wrapper for all admin pages.
 * Renders the sidebar alongside page content.
 *
 * Usage:
 *   <AdminPageLayout className="bg-[#f1f1f9]">
 *     <div className="flex-1 p-8 space-y-6 min-w-0">
 *       ...page content...
 *     </div>
 *   </AdminPageLayout>
 */
export default function AdminPageLayout({
  children,
  className = "bg-[#f5f7fb]",
}: AdminPageLayoutProps) {
  return (
    <div className={`flex min-h-screen ${className}`}>
      <AsideSidebar />
      {children}
    </div>
  );
}
