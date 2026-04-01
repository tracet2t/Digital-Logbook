import React from "react";

import {
  MENTOR_LOGO_CONFIG,
  MENTOR_MENU_ITEMS,
} from "@/utils/config/mentorSidebarConfig";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AsideSidebar from "@/components/AsideSidebar";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  /** Tailwind bg class for the page background. Defaults to bg-[#f5f7fb] */
  className?: string;
}

function MentorLayout({
  children,
  className = "bg-[#f5f7fb]",
}: AdminPageLayoutProps) {
  return (
    <div>
      <SidebarProvider>
        <AsideSidebar menu={MENTOR_MENU_ITEMS} logo={MENTOR_LOGO_CONFIG} />
        <SidebarInset className={className}>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default MentorLayout;
