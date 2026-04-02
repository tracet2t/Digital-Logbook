"use client";

import { useState } from "react";

import { useLogout } from "@/_hooks/core/useLogout";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ConfirmDeleteDialog from "@/components/ConfirmLogoutDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

interface UserInfo {
  fname: string;
  lname: string;
  role: string;
  email: string;
}

const ROLE_LABELS: Record<string, string> = {
  superAdmin: "Super Admin",
  mentor: "Mentor",
  student: "Student",
};

const getInitials = (f: string, l: string) =>
  `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase() || "?";

export default function UserDropdown({
  user,
  onNavigate,
}: {
  user: UserInfo;
  onNavigate: (href: string) => void;
}) {
  const fullName = `${user.fname} ${user.lname}`;
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout, isPending } = useLogout();
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setShowLogoutDialog(false);
        router.push("/login");
      },
    });
  };
  return (
    <>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={undefined} alt={fullName} />
                    <AvatarFallback className="bg-[#000053] text-white text-xs font-bold">
                      {getInitials(user.fname, user.lname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-[#0A0A0A] text-sm font-semibold leading-tight truncate">
                      {fullName}
                    </p>
                    <p className="text-[#737373] text-[10px] font-bold tracking-wider uppercase leading-tight">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-[#737373]" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-48 mb-5"
              >
                <DropdownMenuItem
                  onSelect={() => onNavigate("/admin/settings")}
                >
                  <Settings size={14} className="mr-2 text-[#737373]" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogoutClick}>
                  <LogOut size={14} className="mr-2 text-red-600" />
                  <span className="text-red-600">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <ConfirmDeleteDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleConfirmLogout}
        isPending={isPending}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access the system."
        confirmLabel="Logout"
      />
    </>
  );
}
