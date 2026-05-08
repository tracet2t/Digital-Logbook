import { Fragment } from "react";

interface RichTextRendererProps {
  text: string;
  className?: string;
}

/**
 * Renders markdown-lite syntax from RichTextEditor into formatted JSX.
 * Supported tokens:
 *   **text**  → <strong>
 *   *text*    → <em>
 *   __text__  → <u>
 *   • text    → bullet line
 */
export function RichTextRenderer({ text, className }: RichTextRendererProps) {
  const lines = text.split("\n");

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {parseLine(line)}
        </Fragment>
      ))}
    </span>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

type Token =
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }
  | { type: "underline"; content: string }
  | { type: "text"; content: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  // Order matters: bold (**) must be checked before italic (*)
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > last) {
      tokens.push({ type: "text", content: input.slice(last, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: "bold", content: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "italic", content: match[2] });
    } else if (match[3] !== undefined) {
      tokens.push({ type: "underline", content: match[3] });
    }
    last = regex.lastIndex;
  }

  if (last < input.length) {
    tokens.push({ type: "text", content: input.slice(last) });
  }

  return tokens;
}

function renderTokens(tokens: Token[]) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "bold":
        return <strong key={i}>{token.content}</strong>;
      case "italic":
        return <em key={i}>{token.content}</em>;
      case "underline":
        return <u key={i}>{token.content}</u>;
      default:
        return <Fragment key={i}>{token.content}</Fragment>;
    }
  });
}

function parseLine(line: string) {
  // Bullet line: starts with "• "
  if (line.startsWith("• ")) {
    const content = line.slice(2);
    return (
      <span className="flex items-start gap-1.5">
        <span className="mt-[3px] shrink-0 text-[10px]">•</span>
        <span>{renderTokens(tokenize(content))}</span>
      </span>
    );
  }
  return <>{renderTokens(tokenize(line))}</>;
}
