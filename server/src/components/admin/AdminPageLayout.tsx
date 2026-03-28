"use client";

import {
  ADMIN_LOGO_CONFIG,
  ADMIN_MENU_ITEMS,
} from "@/utils/config/adminSidebarConfig";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AsideSidebar menu={ADMIN_MENU_ITEMS} logo={ADMIN_LOGO_CONFIG} />
      <SidebarInset className={className}>{children}</SidebarInset>
    </SidebarProvider>
  );
}
