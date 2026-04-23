import React from "react";

import {
  MENTOR_LOGO_CONFIG,
  MENTOR_MENU_ITEMS,
} from "@/utils/config/mentorSidebarConfig";
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

function MentorLayout({
  children,
  className = "bg-[#f5f7fb]",
}: AdminPageLayoutProps) {
  return (
    <div>
      <SidebarProvider>
        <AsideSidebar menu={MENTOR_MENU_ITEMS} logo={MENTOR_LOGO_CONFIG} />
        <SidebarInset className={className}>
          {/* Mobile top bar — visible only on mobile */}
          <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-[#e3e6ef] sticky top-0 z-30">
            <SidebarTrigger className="h-9 w-9 [&_svg]:size-5" />
            <Image
              src={MENTOR_LOGO_CONFIG.expanded.src}
              alt="Digital Logbook"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default MentorLayout;
