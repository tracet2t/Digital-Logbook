"use client";

import { useState } from "react";

import {
  EyeOff,
  Image as ImageIcon,
  Monitor,
  PanelRight,
  Pencil,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { ArticlePreviewModal } from "@/components/admin/ArticlePreviewModal";
import { RichTextRenderer } from "@/components/admin/RichTextRenderer";

import { CmsCard } from "../../app/admin/landing-page-cms/_constants";

interface PreviewCanvasProps {
  cards: CmsCard[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddCard: () => void;
  editorOpen: boolean;
  onToggleEditor: () => void;
}

export function PreviewCanvas({
  cards,
  activeId,
  onSelect,
  onAddCard,
  editorOpen,
  onToggleEditor,
}: PreviewCanvasProps) {
  const [previewCard, setPreviewCard] = useState<CmsCard | null>(null);
  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
            Live Preview Canvas
          </p>
          <p className="text-sm font-bold text-[#0F172A]">
            Landing Page Content
          </p>
        </div>
        {!editorOpen && (
          <button
            onClick={onToggleEditor}
            title="Open editor panel"
            className="rounded-lg border border-[#E5E5E5] bg-white p-2 text-[#64748B] transition-colors hover:border-[#000053] hover:text-[#000053]"
          >
            <PanelRight size={18} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`relative flex cursor-pointer flex-col gap-4 p-4 transition-all duration-200 sm:flex-row sm:items-center sm:gap-5 sm:p-5 ${
              activeId === card.id
                ? "scale-[1.01] border-[#000053] ring-2 ring-[#000053]"
                : "border-[#E5E5E5] hover:border-[#CBD5E1]"
            } ${!card.isVisible ? "opacity-60 grayscale-[0.4]" : ""}`}
          >
            {/* Click wrapper — opens preview modal */}
            <div
              className="absolute inset-0 z-10 rounded-xl"
              onClick={() => setPreviewCard(card)}
            />

            {!card.isVisible && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/30 backdrop-blur-[1px]">
                <span className="flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white">
                  <EyeOff size={11} /> Hidden from portal
                </span>
              </div>
            )}

            {/* Thumbnail */}
            <div className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] sm:h-28 sm:w-40">
              {card.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.imageUrl}
                  className="h-full w-full object-cover"
                  alt={card.title}
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#CBD5E1]">
                  <ImageIcon size={28} strokeWidth={1.5} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    No Media
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-600">
                  {card.tag}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                  {card.date}
                </p>
              </div>
              <h4 className="mb-1.5 truncate text-lg font-black text-[#0F172A]">
                {card.title}
              </h4>
              <p className="line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
                <RichTextRenderer text={card.description} />
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(card.id);
              }}
              title="Edit card"
              className="relative z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#64748B] opacity-0 shadow-sm transition-all hover:border-[#000053] hover:bg-[#000053] hover:text-white group-hover/card:opacity-100 sm:opacity-100"
            >
              <Pencil size={14} />
            </button>
          </Card>
        ))}

        {cards.length === 0 && (
          <div className="flex h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-white text-[#CBD5E1]">
            <Monitor size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No content cards</p>
            <button
              onClick={onAddCard}
              className="mt-2 text-xs font-bold text-[#000053] underline"
            >
              Add New Card
            </button>
          </div>
        )}
      </div>

      {/* ── Premium article preview modal ── */}
      <ArticlePreviewModal
        card={previewCard}
        open={!!previewCard}
        onOpenChange={(open) => {
          if (!open) setPreviewCard(null);
        }}
      />
    </div>
  );
}
