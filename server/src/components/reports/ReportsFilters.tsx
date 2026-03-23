import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterBar from "@/components/admin/FilterBar";

interface Props {
  projectFilter: string;
  mentorFilter: string;
  dateFrom: string;
  dateTo: string;
  projectOptions: string[];
  mentorOptions: string[];
  onProjectChange: (value: string) => void;
  onMentorChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
}

// Filter bar for reports — uses shared FilterBar compound component
export function ReportsFilters({
  projectFilter,
  mentorFilter,
  dateFrom,
  dateTo,
  projectOptions,
  mentorOptions,
  onProjectChange,
  onMentorChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: Props) {
  return (
    <FilterBar>
      <FilterBar.Field label="Project">
        <Select value={projectFilter} onValueChange={onProjectChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectOptions.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar.Field>
      <FilterBar.Field label="Mentor">
        <Select value={mentorFilter} onValueChange={onMentorChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Mentor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mentors</SelectItem>
            {mentorOptions.map((mentor) => (
              <SelectItem key={mentor} value={mentor}>
                {mentor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar.Field>
      <FilterBar.Field label="From">
        <input
          type="date"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="h-8 rounded-lg border border-[#dbe0e8] bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        />
      </FilterBar.Field>
      <FilterBar.Field label="To">
        <input
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => onDateToChange(e.target.value)}
          className="h-8 rounded-lg border border-[#dbe0e8] bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        />
      </FilterBar.Field>
      <Button
        variant="ghost"
        className="self-end text-[#737373] hover:text-[#0A0A0A]"
        onClick={onReset}
      >
        Reset
      </Button>
    </FilterBar>
  );
}
