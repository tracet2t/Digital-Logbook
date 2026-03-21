import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Filter bar for  reports
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
    <div className="p-4 border-b border-[#E5E5E5]">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
            Project
          </label>
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
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
            Mentor
          </label>
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
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => onDateToChange(e.target.value)}
            className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <Button
          variant="ghost"
          className="text-[#737373] hover:text-[#0A0A0A]"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
