import { useCallback, useEffect, useState } from "react";

import { CmsCard } from "@/app/admin/landing-page-cms/_constants";
import { toast } from "sonner";

export function useLandingPageCmsPage() {
  const [cards, setCards] = useState<CmsCard[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load cards from DB on mount ──────────────────────────────────────────
  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data: CmsCard[]) => {
        setCards(data);
        if (data.length > 0) setActiveId(data[0].id);
      })
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setIsLoading(false));
  }, []);

  const activeCard = cards.find((c) => c.id === activeId) ?? cards[0];

  // ── Local update (optimistic) ────────────────────────────────────────────
  const update = useCallback(
    (patch: Partial<CmsCard>) =>
      setCards((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, ...patch } : c)),
      ),
    [activeId],
  );

  // ── Save draft (PUT current card) ────────────────────────────────────────
  const saveDraft = useCallback(async () => {
    const card = cards.find((c) => c.id === activeId);
    if (!card) return;
    try {
      const res = await fetch(`/api/articles/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      if (!res.ok) throw new Error();
      const saved: CmsCard = await res.json();
      setCards((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      toast.success("Draft saved", {
        description: "Your changes have been saved.",
      });
    } catch {
      toast.error("Failed to save draft");
    }
  }, [activeId, cards]);

  // ── Add new card (POST) ──────────────────────────────────────────────────
  const addCard = useCallback(async () => {
    const newCard = {
      title: "Draft Event Title",
      description: "Enter a short summary for the landing page...",
      date: "TBD — SET DATE",
      rawDate: "",
      rawTime: "",
      isVisible: false,
      imageName: null,
      imageUrl: null,
      tag: "DRAFT",
      registerLink: "",
      venue: "",
      venueMapLink: "",
    };
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      if (!res.ok) throw new Error();
      const created: CmsCard = await res.json();
      setCards((prev) => [...prev, created]);
      setActiveId(created.id);
    } catch {
      toast.error("Failed to create event");
    }
  }, []);

  // ── Delete active card (DELETE) ──────────────────────────────────────────
  const deleteActive = useCallback(async () => {
    if (!activeId) return;
    try {
      const res = await fetch(`/api/articles/${activeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      const remaining = cards.filter((c) => c.id !== activeId);
      setCards(remaining);
      setActiveId(remaining.length > 0 ? remaining[0].id : "");
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  }, [activeId, cards]);

  // ── Publish (save all cards to DB) ───────────────────────────────────────
  const publish = useCallback(async () => {
    try {
      await Promise.all(
        cards.map((card) =>
          fetch(`/api/articles/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(card),
          }),
        ),
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      toast.error("Failed to publish changes");
    }
  }, [cards]);

  return {
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
  };
}
