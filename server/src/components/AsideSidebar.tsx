"use client";

import { ReactNode, useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";
import {
  Award,
  BarChart2,
  FolderOpen,
  LayoutDashboard,
  Mail,
  Users,
} from "lucide-react";
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

interface UserInfo {
  fname: string;
  lname: string;
  role: string;
  email: string;
}

const MAIN_MENU: { label: string; icon: ReactNode; href: string }[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
  { label: "Users", icon: <Users size={18} />, href: "/admin/users" },
  { label: "Invitations", icon: <Mail size={18} />, href: "/admin/invitation" },
  {
    label: "Projects",
    icon: <FolderOpen size={18} />,
    href: "/admin/projects",
  },
  { label: "Badges", icon: <Award size={18} />, href: "/admin/badges" },
  { label: "Reports", icon: <BarChart2 size={18} />, href: "/admin/reports" },
];

const LOGO = {
  expanded: {
    src: "/logo.png",
    width: 240,
    height: 60,
    className: "h-auto w-full max-w-[144px] shrink-0",
  },
  collapsed: {
    src: "/logo - small.png",
    width: 49,
    height: 40,
    className: "h-10 w-auto shrink-0",
  },
};

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto";
const ACTIVE_CLASS =
  "bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:text-white data-[active=true]:bg-[#4F46E5] data-[active=true]:text-white data-[active=true]:hover:bg-[#4338CA]";
const INACTIVE_CLASS = "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]";

const menuBtnClass = (active: boolean) =>
  `${COLLAPSED_BASE} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`;

function LogoHeader({ collapsed }: { collapsed: boolean }) {
  const logo = collapsed ? LOGO.collapsed : LOGO.expanded;
  return (
    <SidebarHeader className="p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
      <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:py-2">
        <Image
          src={logo.src}
          alt="Digital Logbook"
          width={logo.width}
          height={logo.height}
          className={logo.className}
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
}: {
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <SidebarContent>
      <SidebarGroup className="group-data-[collapsible=icon]:px-3">
        <SidebarGroupLabel className="text-[#737373] text-[11px] font-bold tracking-[0.1em] uppercase">
          Main Menu
        </SidebarGroupLabel>
        <SidebarMenu className="gap-3">
          {MAIN_MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <SidebarMenuItem
                key={item.href}
                className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
              >
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.label}
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

export default function AsideSidebar() {
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
    <Sidebar collapsible="icon" className="relative">
      <LogoHeader collapsed={collapsed} />
      <NavMenu pathname={pathname} onNavigate={navigate} />
      {user && <UserDropdown user={user} onNavigate={navigate} />}
      <SidebarRail />
    </Sidebar>
  );
}
