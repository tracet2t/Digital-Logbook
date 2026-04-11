import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterBar } from "@/components/admin";

import { UserRole, UserStatus } from "./types";

interface UsersFiltersProps {
  roleFilter: "all" | UserRole;
  statusFilter: "all" | UserStatus;
  batchFilter: "all" | string;
  batchOptions: string[];
  search: string;
  onRoleChange: (value: "all" | UserRole) => void;
  onStatusChange: (value: "all" | UserStatus) => void;
  onBatchChange: (value: "all" | string) => void;
  onSearchChange: (value: string) => void;
}

export default function UsersFilters({
  roleFilter,
  statusFilter,
  batchFilter,
  batchOptions,
  search,
  onRoleChange,
  onStatusChange,
  onBatchChange,
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
            <SelectItem value="Student">Mentee</SelectItem>
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

      <FilterBar.Field label="Batch">
        <Select
          value={batchFilter}
          onValueChange={(value) => onBatchChange(value as "all" | string)}
        >
          <SelectTrigger className="h-8 w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batchOptions.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
            <SelectItem value="__none__">No Batch</SelectItem>
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
