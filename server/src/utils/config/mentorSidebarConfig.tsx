import {
  BarChart2,
  Book,
  BookKey,
  Calendar,
  LayoutDashboard,
  School,
  Users,
} from "lucide-react";

import { LogoConfig, MenuItem } from "@/components/AsideSidebar";

export const MENTOR_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/mentor/dashboard",
  },
  { label: "Calendar", icon: <Calendar size={18} />, href: "/mentor/calendar" },

  { label: "Mentees", icon: <Users size={18} />, href: "/mentor/mentees" },
];

export const MENTOR_LOGO_CONFIG: LogoConfig = {
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
