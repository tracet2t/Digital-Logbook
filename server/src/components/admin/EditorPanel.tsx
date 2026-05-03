"use client";

import {
  Calendar,
  Eye,
  EyeOff,
  FileImage,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  CmsCard,
  formatDisplayDate,
} from "../../app/admin/landing-page-cms/_constants";

interface EditorPanelProps {
  activeCard: CmsCard;
  onUpdate: (patch: Partial<CmsCard>) => void;
  onAddCard: () => void;
  onDeleteActive: () => void;
  onPublish: () => void;
}

export function EditorPanel({
  activeCard,
  onUpdate,
  onAddCard,
  onDeleteActive,
  onPublish,
}: EditorPanelProps) {
  return (
    <div className="flex w-full shrink-0 flex-col border-t border-[#E5E5E5] bg-white p-4 md:p-6 lg:w-[400px] lg:overflow-y-auto lg:border-l lg:border-t-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          Content Editor
        </p>
        <Button
          onClick={onAddCard}
          size="sm"
          className="bg-[#000053] text-[10px] uppercase tracking-widest text-white hover:bg-[#000053]/90"
        >
          <Plus size={13} />
          Create Event
        </Button>
      </div>

      <div className="flex-1 space-y-6">
        {/* Visibility toggle */}
        <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeCard.isVisible ? (
                <Eye size={15} className="text-green-500" />
              ) : (
                <EyeOff size={15} className="text-[#94A3B8]" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                Show on Landing Page
              </span>
            </div>
            <button
              onClick={() => onUpdate({ isVisible: !activeCard.isVisible })}
              className={`relative flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
                activeCard.isVisible ? "bg-green-500" : "bg-[#E5E5E5]"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  activeCard.isVisible ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-[9px] leading-normal text-[#94A3B8]">
            Enable to make this event visible on the public landing page.
          </p>
        </div>

        {/* Tag */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
            Tag
          </label>
          <input
            type="text"
            value={activeCard.tag}
            onChange={(e) => onUpdate({ tag: e.target.value })}
            className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
            placeholder="e.g. WORKSHOP"
          />
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
            <Calendar size={11} className="text-[#000053]" />
            Event Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-left text-sm font-medium transition-all hover:border-[#000053] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#000053]/10">
                <Calendar size={14} className="shrink-0 text-[#000053]" />
                <span
                  className={
                    activeCard.rawDate ? "text-[#0F172A]" : "text-[#94A3B8]"
                  }
                >
                  {activeCard.rawDate
                    ? formatDisplayDate(activeCard.rawDate)
                    : "Pick a date…"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                className="[--cell-size:--spacing(14)] p-4"
                selected={
                  activeCard.rawDate
                    ? new Date(activeCard.rawDate + "T00:00:00")
                    : undefined
                }
                onSelect={(day) => {
                  if (!day) {
                    onUpdate({ rawDate: "", date: "TBD — SET DATE" });
                    return;
                  }
                  const iso = day.toLocaleDateString("en-CA");
                  onUpdate({ rawDate: iso, date: formatDisplayDate(iso) });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Media Asset */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
            Media Asset
          </label>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E5E5] bg-[#F8FAFC] p-6 transition-colors hover:border-[#CBD5E1]">
            <Upload
              size={24}
              className="mb-1.5 text-[#94A3B8]"
              strokeWidth={1.5}
            />
            <p className="text-xs font-bold text-[#64748B]">Upload Image</p>
          </div>
          {activeCard.imageName ? (
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-500">
                  <FileImage size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#0F172A]">
                    {activeCard.imageName}
                  </p>
                  <p className="text-[9px] font-bold uppercase text-[#94A3B8]">
                    Ready to publish
                  </p>
                </div>
              </div>
              <button
                onClick={() => onUpdate({ imageName: null, imageUrl: null })}
                className="px-2 text-[#CBD5E1] transition-colors hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] bg-[#F8FAFC] p-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">
                No file selected
              </span>
            </div>
          )}
        </div>

        {/* Event Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
            Event Title
          </label>
          <input
            type="text"
            value={activeCard.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
            placeholder="Enter event title..."
          />
        </div>

        {/* Description */}
        <div className="space-y-2 pb-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
              Description
            </label>
            <span
              className={`text-[10px] font-bold ${
                activeCard.description.length > 250
                  ? "text-red-400"
                  : "text-[#CBD5E1]"
              }`}
            >
              {activeCard.description.length} / 280
            </span>
          </div>
          <textarea
            rows={4}
            value={activeCard.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full resize-none rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
            placeholder="Describe your event content..."
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="space-y-3 border-t border-[#E5E5E5] bg-white pt-4 lg:sticky lg:bottom-0">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#E5E5E5] text-[10px] uppercase tracking-widest text-[#64748B]"
          >
            Save Draft
          </Button>
          <Button
            onClick={onPublish}
            className="flex-1 bg-[#000053] text-[10px] uppercase tracking-widest text-white hover:bg-[#000053]/90"
          >
            Update Content
          </Button>
        </div>
        <button
          onClick={onDeleteActive}
          className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 transition-colors hover:text-red-600"
        >
          Delete Content
        </button>
      </div>
    </div>
  );
}
