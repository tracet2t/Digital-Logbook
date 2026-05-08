"use client";

import { useRef } from "react";

import {
  AlignCenter,
  AlignLeft,
  Bold,
  Italic,
  List,
  Underline,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  charCount?: number;
  maxChars?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter brief content information",
  rows = 4,
  charCount,
  maxChars,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-all focus-within:border-[#000053] focus-within:ring-2 focus-within:ring-[#000053]/10">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E5] bg-[#F8FAFC] px-3 py-2">
        <button
          type="button"
          title="Bold — wraps selection with **"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("**");
          }}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <Bold size={14} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Italic — wraps selection with *"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("*");
          }}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          title="Underline — wraps selection with __"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("__");
          }}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <Underline size={14} />
        </button>
        <div className="mx-1 h-4 w-px bg-[#E5E5E5]" />
        <button
          type="button"
          title="Align Left"
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          title="Align Center"
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          title="Bullet List — prepends • to current line"
          onMouseDown={(e) => {
            e.preventDefault();
            applyList();
          }}
          className="rounded p-1.5 text-[#64748B] transition-colors hover:bg-white hover:text-[#000053]"
        >
          <List size={14} />
        </button>

        {/* Character count pushed to the right */}
        {maxChars !== undefined && charCount !== undefined && (
          <span
            className={`ml-auto text-[10px] font-bold ${
              charCount > maxChars * 0.9 ? "text-red-400" : "text-[#CBD5E1]"
            }`}
          >
            {charCount} / {maxChars}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none bg-white px-4 py-3 text-sm font-medium text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
        placeholder={placeholder}
      />
    </div>
  );
}
