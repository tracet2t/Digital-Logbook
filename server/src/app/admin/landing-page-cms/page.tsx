"use client";

import { useLandingPageCmsPage } from "@/_hooks/admin/useLandingPageCmsPage";

import { Button } from "@/components/ui/button";
import { AdminPageLayout, PageHeader } from "@/components/admin";
import { EditorPanel } from "@/components/admin/EditorPanel";
import { PreviewCanvas } from "@/components/admin/PreviewCanvas";
import { PublishToast } from "@/components/admin/PublishToast";

export default function LandingPageCmsPage() {
  const {
    cards,
    activeCard,
    activeId,
    setActiveId,
    showToast,
    setShowToast,
    update,
    addCard,
    deleteActive,
    publish,
  } = useLandingPageCmsPage();

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
          <div className="flex flex-col lg:flex-1 lg:flex-row lg:overflow-hidden">
            <PreviewCanvas
              cards={cards}
              activeId={activeId}
              onSelect={setActiveId}
              onAddCard={addCard}
            />
            {activeCard && (
              <EditorPanel
                activeCard={activeCard}
                onUpdate={update}
                onAddCard={addCard}
                onDeleteActive={deleteActive}
                onPublish={publish}
              />
            )}
          </div>
        </div>
      </AdminPageLayout>

      {showToast && <PublishToast onClose={() => setShowToast(false)} />}
    </>
  );
}
