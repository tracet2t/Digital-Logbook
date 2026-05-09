import {
  Award,
  BarChart2,
  FolderOpen,
  LayoutDashboard,
  Mail,
  Monitor,
  UserCheck,
  Users,
} from "lucide-react";

import { LogoConfig, MenuItem } from "@/components/AsideSidebar";

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
  { label: "Users", icon: <Users size={18} />, href: "/admin/users" },
  {
    label: "Onboarding",
    icon: <UserCheck size={18} />,
    href: "/admin/onboarding",
  },
  { label: "Invitations", icon: <Mail size={18} />, href: "/admin/invitation" },
  {
    label: "Projects",
    icon: <FolderOpen size={18} />,
    href: "/admin/projects",
  },
  { label: "Badges", icon: <Award size={18} />, href: "/admin/badges" },
  { label: "Reports", icon: <BarChart2 size={18} />, href: "/admin/reports" },
  {
    label: "Landing Page CMS",
    icon: <Monitor size={18} />,
    href: "/admin/landing-page-cms",
  },
];

export const ADMIN_LOGO_CONFIG: LogoConfig = {
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
