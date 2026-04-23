import React from "react";

import {
  STUDENT_LOGO_CONFIG,
  STUDENT_MENU_ITEMS,
} from "@/utils/config/studentSidebarConfig";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AsideSidebar from "@/components/AsideSidebar";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <SidebarProvider>
      <AsideSidebar menu={STUDENT_MENU_ITEMS} logo={STUDENT_LOGO_CONFIG} />
      <SidebarInset className="bg-[#f1f1f9]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
