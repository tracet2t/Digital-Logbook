"use client";

import { Calendar, Clock, EyeOff, Image as ImageIcon, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { RichTextRenderer } from "@/components/admin/RichTextRenderer";

import { CmsCard } from "../../app/admin/landing-page-cms/_constants";

interface ArticlePreviewModalProps {
  card: CmsCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlePreviewModal({
  card,
  open,
  onOpenChange,
}: ArticlePreviewModalProps) {
  if (!card) return null;

  const hasTime = !!card.rawTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent backdrop-blur-sm" />
      <DialogContent className="max-h-[90vh] max-w-2xl flex flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl">
        {/* ── Close button ── */}
        <DialogClose className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70">
          <X size={16} />
        </DialogClose>

        {/* ── Hero image ── */}
        <div className="relative h-[17.5rem] w-full overflow-hidden sm:h-[22.5rem] md:h-[25rem]">
          {card.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imageUrl}
              alt={card.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <ImageIcon
                size={56}
                className="text-slate-300"
                strokeWidth={1.2}
              />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Tag + visibility badge + register button */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
                {card.tag}
              </span>
              {!card.isVisible && (
                <span className="flex items-center gap-1 rounded-md bg-amber-500/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  <EyeOff size={11} /> Hidden
                </span>
              )}
            </div>
            {card.registerLink && (
              <a
                href={card.registerLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-md bg-[#000053]/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur-md transition-all hover:bg-[#000053] hover:shadow-xl"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                Register
              </a>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-8 pt-5">
          {/* Date */}
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {card.date}
            </span>
            {hasTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {card.rawTime}
              </span>
            )}
            {card.venue && (
              <span className="flex items-center gap-1.5">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {card.venueMapLink ? (
                  <a
                    href={card.venueMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#000053]"
                  >
                    {card.venue}
                  </a>
                ) : (
                  card.venue
                )}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black leading-tight text-[#0F172A] sm:text-3xl">
            {card.title}
          </h2>

          {/* Divider */}
          <div className="h-px w-16 bg-[#000053]" />

          {/* Description */}
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-[#475569]">
            <RichTextRenderer text={card.description} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
