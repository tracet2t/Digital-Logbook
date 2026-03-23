"use client";

import React from "react";

import { Search } from "lucide-react";

// ─── Sub-component: FilterField ──────────────────────────────────────────────

interface FilterFieldProps {
  /** Short uppercase label shown above the control */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A labeled wrapper for a single filter control (Select, date input, etc.).
 *
 * Usage:
 *   <FilterBar.Field label="Role">
 *     <Select value={roleFilter} onValueChange={setRoleFilter}>...</Select>
 *   </FilterBar.Field>
 */
function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Sub-component: FilterSearch ─────────────────────────────────────────────

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search input with a magnifier icon, auto-positioned to the far right of the
 * filter bar via ml-auto.
 *
 * Usage:
 *   <FilterBar.Search
 *     value={search}
 *     onChange={(v) => { setSearch(v); setPage(1); }}
 *     placeholder="Search by name, email, or ID..."
 *   />
 */
function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
}: FilterSearchProps) {
  return (
    <FilterField label="Search" className="ml-auto w-full sm:w-auto">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 w-full sm:w-[360px] rounded-lg border border-[#dbe0e8] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
        />
      </div>
    </FilterField>
  );
}

// ─── Root component: FilterBar ───────────────────────────────────────────────

interface FilterBarProps {
  children: React.ReactNode;
}

/**
 * Horizontal filter bar used at the top of admin data tables.
 * Provides consistent spacing, border and background styling.
 *
 * Compound sub-components:
 *   FilterBar.Field  – labeled wrapper for any filter control
 *   FilterBar.Search – search input auto-aligned to the right
 *
 * Usage:
 *   <FilterBar>
 *     <FilterBar.Field label="Role">
 *       <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
 *         <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue /></SelectTrigger>
 *         <SelectContent>
 *           <SelectItem value="all">All Roles</SelectItem>
 *           <SelectItem value="Student">Student</SelectItem>
 *         </SelectContent>
 *       </Select>
 *     </FilterBar.Field>
 *
 *     <FilterBar.Search
 *       value={search}
 *       onChange={(v) => { setSearch(v); setPage(1); }}
 *       placeholder="Search by name, email, or ID..."
 *     />
 *   </FilterBar>
 */
function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e4e7ed] bg-[#f8fafc] p-3">
      {children}
    </div>
  );
}

FilterBar.Field = FilterField;
FilterBar.Search = FilterSearch;

export default FilterBar;
