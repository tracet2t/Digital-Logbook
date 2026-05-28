"use client";

import React, { useRef, useState } from "react";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  Underline,
} from "lucide-react";

import { RichTextRenderer } from "@/components/admin/RichTextRenderer";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  rows = 5,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [align, setAlign] = useState<"left" | "center" | "right" | "justify">(
    "left",
  );

  const applyFormat = (wrapper: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newText =
      value.slice(0, start) + wrapper + selected + wrapper + value.slice(end);
    onChange(newText);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + wrapper.length, end + wrapper.length);
    });
  };

  const applyList = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newText = value.slice(0, lineStart) + "• " + value.slice(lineStart);
    onChange(newText);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 2, start + 2);
    });
  };

  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const alignStyles: Record<string, React.CSSProperties> = {
    left: { textAlign: "left" },
    center: { textAlign: "center" },
    right: { textAlign: "right" },
    justify: { textAlign: "justify" },
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-all focus-within:border-[#000053] focus-within:ring-2 focus-within:ring-[#000053]/10">
      {/* ── Tab row ── */}
      <div className="flex border-b border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
            tab === "write"
              ? "border-b-2 border-[#000053] text-[#000053]"
              : "text-[#94A3B8] hover:text-[#64748B]"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
            tab === "preview"
              ? "border-b-2 border-[#000053] text-[#000053]"
              : "text-[#94A3B8] hover:text-[#64748B]"
          }`}
        >
          Preview
        </button>
      </div>

      {tab === "write" ? (
        <>
          {/* ── Toolbar ── */}
          <div className="flex items-center gap-0.5 border-b border-[#E5E5E5] bg-[#F8FAFC] px-3 py-1.5">
            <button
              type="button"
              title="Bold"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("**");
              }}
              className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
            >
              <Bold size={13} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              title="Italic"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("*");
              }}
              className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
            >
              <Italic size={13} />
            </button>
            <button
              type="button"
              title="Underline"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat("__");
              }}
              className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
            >
              <Underline size={13} />
            </button>
            <div className="mx-1.5 h-4 w-px bg-[#E5E5E5]" />
            <button
              type="button"
              title="Align Left"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlign("left");
              }}
              className={`rounded p-1.5 transition-colors hover:bg-white hover:text-[#000053] ${
                align === "left" ? "bg-white text-[#000053]" : "text-[#64748B]"
              }`}
            >
              <AlignLeft size={13} />
            </button>
            <button
              type="button"
              title="Align Center"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlign("center");
              }}
              className={`rounded p-1.5 transition-colors hover:bg-white hover:text-[#000053] ${
                align === "center"
                  ? "bg-white text-[#000053]"
                  : "text-[#64748B]"
              }`}
            >
              <AlignCenter size={13} />
            </button>
            <button
              type="button"
              title="Align Right"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlign("right");
              }}
              className={`rounded p-1.5 transition-colors hover:bg-white hover:text-[#000053] ${
                align === "right" ? "bg-white text-[#000053]" : "text-[#64748B]"
              }`}
            >
              <AlignRight size={13} />
            </button>
            <button
              type="button"
              title="Justify"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlign("justify");
              }}
              className={`rounded p-1.5 transition-colors hover:bg-white hover:text-[#000053] ${
                align === "justify"
                  ? "bg-white text-[#000053]"
                  : "text-[#64748B]"
              }`}
            >
              <AlignJustify size={13} />
            </button>
            <button
              type="button"
              title="Bullet List"
              onMouseDown={(e) => {
                e.preventDefault();
                applyList();
              }}
              className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
            >
              <List size={13} />
            </button>
          </div>

          {/* ── Textarea ── */}
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={alignStyles[align]}
            className={`w-full resize-none bg-white px-4 py-3 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] ${alignClasses[align]}`}
            placeholder={placeholder}
          />
        </>
      ) : (
        /* ── Preview pane ── */
        <div
          className={`min-h-[120px] px-4 py-3 text-sm leading-relaxed text-[#0F172A] ${alignClasses[align]}`}
          style={{ minHeight: `${rows * 1.75}rem`, ...alignStyles[align] }}
        >
          {value.trim() ? (
            <RichTextRenderer text={value} />
          ) : (
            <span className="text-[#94A3B8]">Nothing to preview yet.</span>
          )}
        </div>
      )}
    </div>
  );
}
