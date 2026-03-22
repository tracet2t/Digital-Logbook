import { FilterBar } from "@/components/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserRole, UserStatus } from "./types";

interface UsersFiltersProps {
  roleFilter: "all" | UserRole;
  statusFilter: "all" | UserStatus;
  search: string;
  onRoleChange: (value: "all" | UserRole) => void;
  onStatusChange: (value: "all" | UserStatus) => void;
  onSearchChange: (value: string) => void;
}

export default function UsersFilters({
  roleFilter,
  statusFilter,
  search,
  onRoleChange,
  onStatusChange,
  onSearchChange,
}: UsersFiltersProps) {
  return (
    <FilterBar>
      <FilterBar.Field label="Role">
        <Select
          value={roleFilter}
          onValueChange={(value) => onRoleChange(value as "all" | UserRole)}
        >
          <SelectTrigger className="h-8 w-[130px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      <FilterBar.Field label="Status">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as "all" | UserStatus)}
        >
          <SelectTrigger className="h-8 w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      <FilterBar.Search
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email, or ID..."
      />
    </FilterBar>
  );
}
