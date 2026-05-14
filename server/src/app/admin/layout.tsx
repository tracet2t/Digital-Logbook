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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AsideSidebar menu={ADMIN_MENU_ITEMS} logo={ADMIN_LOGO_CONFIG} />
      <SidebarInset>
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
