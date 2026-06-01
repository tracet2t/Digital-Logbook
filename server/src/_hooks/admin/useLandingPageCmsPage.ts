import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CmsCard } from "@/app/admin/landing-page-cms/_constants";
import { toast } from "sonner";

const ARTICLES_KEY = ["articles"] as const;

export function useLandingPageCmsPage() {
  const queryClient = useQueryClient();

  // ── Fetch cards ──────────────────────────────────────────────────────────
  const { data: cards = [], isLoading } = useQuery<CmsCard[]>({
    queryKey: ARTICLES_KEY,
    queryFn: async () => {
      const res = await fetch("/api/articles");
      if (!res.ok) throw new Error("Failed to load articles");
      return res.json();
    },
  });

  const [activeId, setActiveId] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Auto-select first card when data loads and nothing is selected yet
  useEffect(() => {
    if (cards.length > 0 && !activeId) {
      setActiveId(cards[0].id);
    }
  }, [cards, activeId]);

  const activeCard = cards.find((c) => c.id === activeId) ?? cards[0];

  // ── Local optimistic update (keystroke-level) ────────────────────────────
  const update = useCallback(
    (patch: Partial<CmsCard>) => {
      queryClient.setQueryData<CmsCard[]>(
        ARTICLES_KEY,
        (old) =>
          old?.map((c) => (c.id === activeId ? { ...c, ...patch } : c)) ?? [],
      );
    },
    [activeId, queryClient],
  );

  // ── Save draft (PUT current card) ────────────────────────────────────────
  const { mutate: saveDraftMut, isPending: isSaving } = useMutation({
    mutationFn: async (card: CmsCard) => {
      const res = await fetch(`/api/articles/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      if (!res.ok) throw new Error();
      return res.json() as Promise<CmsCard>;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<CmsCard[]>(
        ARTICLES_KEY,
        (old) => old?.map((c) => (c.id === saved.id ? saved : c)) ?? [],
      );
      toast.success("Draft saved", {
        description: "Your changes have been saved.",
      });
    },
    onError: () => toast.error("Failed to save draft"),
  });

  // Wrap to match existing call signature (no argument, picks active card)
  const saveDraft = useCallback(() => {
    const card = queryClient
      .getQueryData<CmsCard[]>(ARTICLES_KEY)
      ?.find((c) => c.id === activeId);
    if (card) saveDraftMut(card);
  }, [activeId, queryClient, saveDraftMut]);

  // ── Add new card (POST) ──────────────────────────────────────────────────
  const { mutate: addCard, isPending: isAdding } = useMutation({
    mutationFn: async () => {
      const newCard = {
        title: "Draft Event Title",
        description: "Enter a short summary for the landing page...",
        date: "TBD — SET DATE",
        rawDate: "",
        rawTime: "",
        isVisible: false,
        coverImage: null,
        images: [],
        tag: "DRAFT",
        registerLink: "",
        venue: "",
        venueMapLink: "",
      };
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      if (!res.ok) throw new Error();
      return res.json() as Promise<CmsCard>;
    },
    onSuccess: (created) => {
      queryClient.setQueryData<CmsCard[]>(ARTICLES_KEY, (old) =>
        old ? [...old, created] : [created],
      );
      setActiveId(created.id);
    },
    onError: () => toast.error("Failed to create event"),
  });

  // ── Delete active card (DELETE) ──────────────────────────────────────────
  const { mutate: deleteActiveMut, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      const remaining =
        queryClient
          .getQueryData<CmsCard[]>(ARTICLES_KEY)
          ?.filter((c) => c.id !== activeId) ?? [];
      queryClient.setQueryData<CmsCard[]>(ARTICLES_KEY, remaining);
      setActiveId(remaining.length > 0 ? remaining[0].id : "");
      toast.success("Event deleted");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  // Wrap to match existing call signature (no argument, picks active id)
  const deleteActive = useCallback(() => {
    if (activeId) deleteActiveMut(activeId);
  }, [activeId, deleteActiveMut]);

  // ── Publish (save all cards to DB) ───────────────────────────────────────
  const { mutate: publishMut, isPending: isPublishing } = useMutation({
    mutationFn: async (allCards: CmsCard[]) => {
      await Promise.all(
        allCards.map((card) =>
          fetch(`/api/articles/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(card),
          }),
        ),
      );
    },
    onSuccess: () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    },
    onError: () => toast.error("Failed to publish changes"),
  });

  const publish = useCallback(() => {
    const allCards = queryClient.getQueryData<CmsCard[]>(ARTICLES_KEY) ?? [];
    publishMut(allCards);
  }, [queryClient, publishMut]);

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
