"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional button/element rendered on the right side */
  action?: React.ReactNode;
  /**
   * "inline" – plain title+action row inside a Card (default)
   * "banner" – white top-bar with border-b (used by invitation page)
   */
  variant?: "inline" | "banner";
}

/**
 * Shared page header for all admin pages.
 *
 * Inline usage (inside a Card):
 *   <PageHeader
 *     title="Projects"
 *     action={<Button onClick={onCreate}>+ Create New Project</Button>}
 *   />
 *
 * Banner usage (full-width top bar):
 *   <PageHeader
 *     variant="banner"
 *     title="Invitations"
 *     subtitle="Manage organizational access."
 *     action={<button onClick={onCreate}>Create Invitation</button>}
 *   />
 */
export default function PageHeader({
  title,
  subtitle,
  action,
  variant = "inline",
}: PageHeaderProps) {
  if (variant === "banner") {
    return (
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-page-title text-[#0A0A0A]">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
