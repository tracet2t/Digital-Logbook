import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterBar } from "@/components/admin";

interface MonitorFiltersCardProps {
  userFilter: string;
  projectFilter: string;
  userStateFilter: string;
  search: string;
  projectOptions: { projects: string[]; hasUnassigned: boolean };
  onProjectFilterChange: (value: string) => void;
  onUserStateFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function MonitorFiltersCard({
  userFilter,
  projectFilter,
  userStateFilter,
  search,
  projectOptions,
  onProjectFilterChange,
  onUserStateFilterChange,
  onSearchChange,
}: MonitorFiltersCardProps) {
  return (
    <FilterBar>
      {userFilter === "all" && (
        <FilterBar.Field label="Project">
          <Select value={projectFilter} onValueChange={onProjectFilterChange}>
            <SelectTrigger className="h-8 w-[200px] bg-white">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projectOptions.hasUnassigned && (
                <SelectItem value="unassigned">Unassigned</SelectItem>
              )}
              {projectOptions.projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar.Field>
      )}
      {userFilter === "all" && (
        <FilterBar.Field label="User state">
          <Select
            value={userStateFilter}
            onValueChange={onUserStateFilterChange}
          >
            <SelectTrigger className="h-8 w-[160px] bg-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar.Field>
      )}
      <FilterBar.Search
        value={search}
        onChange={onSearchChange}
        placeholder="Search users..."
      />
    </FilterBar>
  );
}
