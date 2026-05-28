"use client";

import React from "react";

import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionItem {
  label: string;
  onSelect: () => void;
  /** "danger" renders text and focus state in red. Default: "default" */
  variant?: "default" | "danger";
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** Renders a separator line ABOVE this item */
  separator?: boolean;
}

interface TableActionMenuProps {
  items: ActionItem[];
  /** Accessible label for the trigger button. Default: "Row actions" */
  ariaLabel?: string;
}

/**
 * Reusable three-dot (⋮) action dropdown used in table rows across all admin
 * pages (users, projects, invitations).
 *
 * Usage:
 *   <TableActionMenu
 *     ariaLabel={`Actions for ${user.name}`}
 *     items={[
 *       { label: "View Details",   onSelect: () => setViewUser(user) },
 *       { label: "Change Status",  onSelect: () => setStatusUser(user) },
 *       { label: "Delete User",    onSelect: () => setDeleteId(user.id), variant: "danger", separator: true },
 *     ]}
 *   />
 */
export default function TableActionMenu({
  items,
  ariaLabel = "Row actions",
}: TableActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <MoreVertical size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onSelect={item.onSelect}
              className={
                item.variant === "danger"
                  ? "text-red-600 focus:text-red-600 focus:bg-red-50"
                  : ""
              }
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
