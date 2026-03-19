"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Mail,
  FolderOpen,
  Award,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const mainMenu: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
  { label: "Users", icon: <Users size={18} />, href: "/admin/users" },
  {label: "Invitations", icon: <Mail size={18} />, href: "/admin/invitation",},
  {label: "Projects",icon: <FolderOpen size={18} />,href: "/admin/projects",},
  { label: "Badges", icon: <Award size={18} />, href: "/admin/badges" },
  { label: "Reports", icon: <BarChart2 size={18} />, href: "/admin/reports" },
];

const systemMenu: NavItem[] = [
  { label: "Settings", icon: <Settings size={18} />, href: "/admin/settings" },
];

export default function AsideSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const NavLink = ({ item }: { item: NavItem }) => (
    <button
      onClick={() => router.push(item.href)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
        isActive(item.href)
          ? "bg-[#3B82F6] text-white"
          : "text-[#737373] hover:bg-white/60 hover:text-[#0A0A0A]",
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
    <aside className="flex flex-col border-r border-[#E5E5E5] bg-[#E5E5E5] w-[220px] min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1A1A] shrink-0">
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

        {/* System Menu */}
        <div className="mt-6 px-2">
          <p className="text-[#737373] text-[11px] font-bold leading-[16.5px] tracking-[0.1em] uppercase mb-2">
            System
          </p>
          <nav className="flex flex-col gap-1">
            {systemMenu.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
            {/* Logout */}
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#737373] hover:bg-white/60 hover:text-[#0A0A0A] transition-colors"
              >
                <LogOut size={18} className="text-[#737373]" />
                Logout
              </button>
            </form>
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
