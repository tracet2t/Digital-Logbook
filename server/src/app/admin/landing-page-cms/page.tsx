"use client";

import { useEffect, useState } from "react";

import { useLandingPageCmsPage } from "@/_hooks/admin/useLandingPageCmsPage";

import { Button } from "@/components/ui/button";
import { AdminPageLayout, PageHeader } from "@/components/admin";
import { EditorPanel } from "@/components/admin/EditorPanel";
import { PreviewCanvas } from "@/components/admin/PreviewCanvas";
import { PublishToast } from "@/components/admin/PublishToast";

export default function LandingPageCmsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    cards,
    activeCard,
    activeId,
    setActiveId,
    showToast,
    setShowToast,
    isLoading,
    update,
    saveDraft,
    addCard,
    deleteActive,
    publish,
  } = useLandingPageCmsPage();

  const [editorOpen, setEditorOpen] = useState(false);

  function handleSelect(id: string) {
    setActiveId(id);
    setEditorOpen(true);
  }

  function handleAddCard() {
    addCard();
    setEditorOpen(true);
  }

  return (
    <>
      <AdminPageLayout className="bg-[#f5f7fb]">
        <div className="flex min-h-screen flex-col">
          {/* ── Top bar ── */}
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[#e3e6ef] bg-white px-4 py-4 md:px-6">
            <PageHeader
              title="Landing Page CMS"
              subtitle="Manage events and content displayed on the public landing page."
            />
            <Button
              onClick={publish}
              className="shrink-0 bg-[#000053] text-white hover:bg-[#000053]/90"
            >
              Publish Changes
            </Button>
          </div>

          {/* ── Body: preview + editor ── */}
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
            {mounted && (
              <>
                <PreviewCanvas
                  cards={cards}
                  activeId={activeId}
                  onSelect={handleSelect}
                  onAddCard={handleAddCard}
                  editorOpen={editorOpen}
                  onToggleEditor={() => setEditorOpen(true)}
                  isLoading={isLoading}
                />
                {activeCard && (
                  <EditorPanel
                    open={editorOpen}
                    onOpenChange={(o) => {
                      setEditorOpen(o);
                      if (!o) setActiveId("");
                    }}
                    activeCard={activeCard}
                    onUpdate={update}
                    onSaveDraft={saveDraft}
                    onAddCard={handleAddCard}
                    onDeleteActive={() => {
                      deleteActive();
                      setEditorOpen(false);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </AdminPageLayout>

      {showToast && <PublishToast onClose={() => setShowToast(false)} />}
    </>
  );
}
