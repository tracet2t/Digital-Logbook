import { useState } from "react";

import {
  CmsCard,
  DEFAULT_CARDS,
} from "@/app/admin/landing-page-cms/_constants";

export function useLandingPageCmsPage() {
  const [cards, setCards] = useState<CmsCard[]>(DEFAULT_CARDS);
  const [activeId, setActiveId] = useState("1");
  const [showToast, setShowToast] = useState(false);

  const activeCard = cards.find((c) => c.id === activeId) ?? cards[0];

  const update = (patch: Partial<CmsCard>) =>
    setCards((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, ...patch } : c)),
    );

  const addCard = () => {
    const newId = Date.now().toString();
    const card: CmsCard = {
      id: newId,
      title: "Draft Event Title",
      description: "Enter a short summary for the landing page...",
      date: "TBD — SET DATE",
      rawDate: "",
      isVisible: true,
      imageName: null,
      imageUrl: null,
      tag: "DRAFT",
    };
    setCards((prev) => [...prev, card]);
    setActiveId(newId);
  };

  const deleteActive = () => {
    const remaining = cards.filter((c) => c.id !== activeId);
    setCards(remaining);
    if (remaining.length > 0) setActiveId(remaining[0].id);
  };

  const publish = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return {
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
  };
}
