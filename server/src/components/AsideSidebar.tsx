"use client";

import React, { useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";
import {
  Award,
  BarChart2,
  BookOpen,
  ChevronUp,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface UserInfo {
  fname: string;
  lname: string;
  role: string;
  email: string;
}

function formatRole(role: string) {
  if (role === "superAdmin") return "Super Admin";
  if (role === "mentor") return "Mentor";
  if (role === "student") return "Mentee";
  return role;
}

function getInitials(fname: string, lname: string) {
  return `${fname?.[0] ?? ""}${lname?.[0] ?? ""}`.toUpperCase() || "?";
}

const mainMenu: NavItem[] = [
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

export default function AsideSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    getSessionOnClient().then((session) => {
      if (session) setUser(session as UserInfo);
    });
  }, []);

  const isActive = (href: string) => pathname === href;

  const NavLink = ({ item }: { item: NavItem }) => (
    <button
      onClick={() => router.push(item.href)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
        isActive(item.href)
          ? "bg-[#4F46E5] text-white"
          : "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]",
      )}
    >
      <span
        className={cn(isActive(item.href) ? "text-white" : "text-[#737373]")}
      >
        {item.icon}
      </span>
      {item.label}
    </button>
  );

  return (
    <aside className="flex flex-col border-r border-[#E5E5E5] bg-white w-[220px] min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4F46E5] shrink-0">
          <BookOpen size={20} color="white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[#0A0A0A] text-base font-extrabold leading-4 tracking-tight">
            Logbook
          </p>
          <p className="text-[#737373] text-[10px] font-bold leading-[15px] tracking-[0.1em] uppercase">
            Mentorship OS
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full px-2">
        {/* Main Menu */}
        <div className="mb-3 px-2">
          <p className="text-[#737373] text-[11px] font-bold leading-[16.5px] tracking-[0.1em] uppercase mb-2">
            Main Menu
          </p>
          <nav className="flex flex-col gap-1">
            {mainMenu.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* Avatar Dropdown */}
      {user && (
        <div className="border-t border-[#E5E5E5] px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors text-left">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src={undefined}
                    alt={`${user.fname} ${user.lname}`}
                  />
                  <AvatarFallback className="bg-[#4F46E5] text-white text-xs font-bold">
                    {getInitials(user.fname, user.lname)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-[#0A0A0A] text-sm font-semibold leading-tight truncate">
                    {user.fname} {user.lname}
                  </p>
                  <p className="text-[#737373] text-[10px] font-bold tracking-wider uppercase leading-tight">
                    {formatRole(user.role)}
                  </p>
                </div>
                <ChevronUp size={14} className="text-[#737373] shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48 mb-1">
              <DropdownMenuItem onSelect={() => router.push("/admin/settings")}>
                <Settings size={14} className="mr-2 text-[#737373]" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/api/logout" method="post" className="w-full">
                  <button
                    type="submit"
                    className="flex items-center gap-2 w-full text-red-600"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
