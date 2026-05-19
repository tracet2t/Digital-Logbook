"use client";

import { useState } from "react";

import {
  Calendar,
  Clock,
  Eye,
  EyeOff,
  FileImage,
  PanelRight,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

import {
  CmsCard,
  formatDisplayDate,
} from "../../app/admin/landing-page-cms/_constants";

interface EditorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCard: CmsCard;
  onUpdate: (patch: Partial<CmsCard>) => void;
  onSaveDraft: () => void;
  onAddCard: () => void;
  onDeleteActive: () => void;
}

export function EditorPanel({
  open,
  onOpenChange,
  activeCard,
  onUpdate,
  onSaveDraft,
  onAddCard,
  onDeleteActive,
}: EditorPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div
        className={`flex shrink-0 flex-col border-l border-[#E5E5E5] bg-white transition-all duration-300 ease-in-out ${
          open ? "w-[400px] opacity-100" : "w-0 overflow-hidden opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              title="Close editor panel"
              className="rounded-lg border border-[#E5E5E5] p-1.5 text-[#64748B] transition-colors hover:border-[#000053] hover:text-[#000053]"
            >
              <PanelRight size={15} />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
              Content Editor
            </p>
          </div>
          <Button
            onClick={onAddCard}
            size="sm"
            className="bg-[#000053] text-[10px] uppercase tracking-widest text-white hover:bg-[#000053]/90"
          >
            <Plus size={13} />
            Create Event
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
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

            {/* Register Link */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000053"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Register Link
              </label>
              <input
                type="url"
                value={activeCard.registerLink}
                onChange={(e) => onUpdate({ registerLink: e.target.value })}
                className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
                placeholder="https://example.com/register"
              />
              {activeCard.registerLink && (
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Register button will appear on this card
                </p>
              )}
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
                <PopoverContent
                  className="w-[18rem] max-w-[calc(100vw-2rem)] p-0"
                  align="start"
                >
                  <CalendarUI
                    mode="single"
                    className="w-full [--cell-size:--spacing(16)] p-5"
                    selected={
                      activeCard.rawDate
                        ? new Date(activeCard.rawDate + "T00:00:00")
                        : undefined
                    }
                    onSelect={(day) => {
                      if (!day) {
                        onUpdate({
                          rawDate: "",
                          date: formatDisplayDate("", activeCard.rawTime),
                        });
                        return;
                      }
                      const iso = day.toLocaleDateString("en-CA");
                      onUpdate({
                        rawDate: iso,
                        date: formatDisplayDate(iso, activeCard.rawTime),
                      });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Event Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                <Clock size={11} className="text-[#000053]" />
                Event Time
              </label>
              <input
                type="time"
                value={activeCard.rawTime}
                onChange={(e) => {
                  const t = e.target.value;
                  onUpdate({
                    rawTime: t,
                    date: activeCard.rawDate
                      ? formatDisplayDate(activeCard.rawDate, t)
                      : "TBD — SET DATE",
                  });
                }}
                className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000053"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Venue
              </label>
              <input
                type="text"
                value={activeCard.venue}
                onChange={(e) => onUpdate({ venue: e.target.value })}
                className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
                placeholder="e.g. Main Auditorium, Online, etc."
              />
              <input
                type="url"
                value={activeCard.venueMapLink}
                onChange={(e) => onUpdate({ venueMapLink: e.target.value })}
                className="w-full rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[#000053] focus:bg-white focus:ring-2 focus:ring-[#000053]/10"
                placeholder="Google Maps link (optional)"
              />
              {activeCard.venueMapLink && (
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Venue will be clickable on map
                </p>
              )}
            </div>
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
                    onClick={() =>
                      onUpdate({ imageName: null, imageUrl: null })
                    }
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                Description
              </label>
              <RichTextEditor
                value={activeCard.description}
                onChange={(val) => onUpdate({ description: val })}
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 space-y-3 border-t border-[#E5E5E5] bg-white px-6 py-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              className="flex-1 border-[#E5E5E5] text-[10px] uppercase tracking-widest text-[#64748B]"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              variant="outline"
              className="flex-1 border-red-200 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={13} />
              Delete Event
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          onDeleteActive();
        }}
        isPending={false}
        title="Delete Event"
        description="This event will be permanently removed from the landing page. This action cannot be undone."
        confirmLabel="Delete Event"
      />
    </>
  );
}
