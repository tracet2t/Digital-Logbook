import React from "react";

import {
  ADMIN_LOGO_CONFIG,
  ADMIN_MENU_ITEMS,
} from "@/utils/config/adminSidebarConfig";
import { Construction } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import PageHeader from "@/components/admin/PageHeader";
import AsideSidebar from "@/components/AsideSidebar";

export default function BadgesPage() {
  return (
    <SidebarProvider>
      <AsideSidebar menu={ADMIN_MENU_ITEMS} logo={ADMIN_LOGO_CONFIG} />
      <SidebarInset className="bg-[#f5f7fb]">
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              <PageHeader
                title="Badges"
                subtitle="Manage and award badges to users."
              />

              <div className="flex flex-col items-center justify-center py-20 px-4">
                <Construction size={64} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Page Under Construction
                </h2>
                <p className="text-slate-500 text-center max-w-md">
                  The Badges management page is currently under development.
                  Please check back soon for this feature.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
