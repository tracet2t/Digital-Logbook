"use client";

import {
  ADMIN_LOGO_CONFIG,
  ADMIN_MENU_ITEMS,
} from "@/utils/config/adminSidebarConfig";
import Image from "next/image";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AsideSidebar from "@/components/AsideSidebar";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  /** Tailwind bg class for the page background. Defaults to bg-[#f5f7fb] */
  className?: string;
}

/**
 * Shared layout wrapper for all admin pages.
 * Renders the sidebar alongside page content.
 * On mobile, shows a hamburger top bar that opens the sidebar as a drawer.
 */
export default function AdminPageLayout({
  children,
  className = "bg-[#f5f7fb]",
}: AdminPageLayoutProps) {
  return (
    <SidebarProvider>
      <AsideSidebar menu={ADMIN_MENU_ITEMS} logo={ADMIN_LOGO_CONFIG} />
      <SidebarInset className={className}>
        {/* Mobile top bar — visible only on mobile */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-[#e3e6ef] sticky top-0 z-30">
          <SidebarTrigger className="h-9 w-9 [&_svg]:size-5" />
          <Image
            src={ADMIN_LOGO_CONFIG.expanded.src}
            alt="Digital Logbook"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
