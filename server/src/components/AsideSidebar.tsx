"use client";

import { ReactNode, useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/UserDropdown";

export interface MenuItem {
  label: string;
  icon: ReactNode;
  href: string;
}

export interface LogoConfig {
  expanded: {
    src: string;
    width: number;
    height: number;
    className: string;
  };
  collapsed: {
    src: string;
    width: number;
    height: number;
    className: string;
  };
}

interface UserInfo {
  fname: string;
  lname: string;
  role: string;
  email: string;
}

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto";
const ACTIVE_CLASS =
  "bg-[#000053] text-white hover:bg-[#000053] hover:text-white data-[active=true]:bg-[#000053] data-[active=true]:text-white data-[active=true]:hover:bg-[#000053]";
const INACTIVE_CLASS = "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]";

const menuBtnClass = (active: boolean) =>
  `${COLLAPSED_BASE} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`;

function LogoHeader({
  collapsed,
  logo,
}: {
  collapsed: boolean;
  logo: LogoConfig;
}) {
  const logoSrc = collapsed ? logo.collapsed : logo.expanded;
  return (
    <SidebarHeader className="p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
      <div
        className={`flex items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:py-2 ${
          collapsed ? "" : "pt-2 pl-2"
        }`}
      >
        <Image
          src={logoSrc.src}
          alt="Digital Logbook"
          width={logoSrc.width}
          height={logoSrc.height}
          className={logoSrc.className}
          style={{ display: "block" }}
        />
        {!collapsed && (
          <SidebarTrigger className="mr-3 h-9 w-9 shrink-0 [&_svg]:size-5" />
        )}
      </div>
      {collapsed && <SidebarTrigger className="mt-1 h-9 w-9 [&_svg]:size-5" />}
    </SidebarHeader>
  );
}

function NavMenu({
  pathname,
  onNavigate,
  collapsed,
  menu,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  collapsed: boolean;
  menu: MenuItem[];
}) {
  return (
    <SidebarContent className="flex-1 overflow-auto">
      <SidebarGroup className="group-data-[collapsible=icon]:px-3">
        <SidebarGroupLabel className="text-[#737373] text-[11px] font-bold tracking-[0.1em] uppercase">
          Main Menu
        </SidebarGroupLabel>
        <SidebarMenu className="gap-3">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <SidebarMenuItem
                key={item.href}
                className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
              >
                <SidebarMenuButton
                  isActive={active}
                  title={collapsed ? item.label : undefined}
                  onClick={() => onNavigate(item.href)}
                  className={menuBtnClass(active)}
                >
                  {item.icon}
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

interface AsideSidebarProps {
  menu: MenuItem[];
  logo: LogoConfig;
}

export default function AsideSidebar({ menu, logo }: AsideSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, state } = useSidebar();
  const collapsed = state === "collapsed";
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    getSessionOnClient().then((s) => {
      if (s) setUser(s as UserInfo);
    });
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-0 left-0 flex h-svh flex-col"
    >
      <LogoHeader collapsed={collapsed} logo={logo} />
      <NavMenu
        pathname={pathname}
        onNavigate={navigate}
        collapsed={collapsed}
        menu={menu}
      />
      {user && (
        <div className="sticky bottom-0 left-0 bg-sidebar">
          <UserDropdown user={user} onNavigate={navigate} />
        </div>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
