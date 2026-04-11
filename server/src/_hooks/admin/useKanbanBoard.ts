import { useEffect, useMemo, useRef, useState } from "react";

import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { OnboardingApplication } from "./useAdminOnboarding";

interface UseKanbanBoardOptions {
  allocations: Array<{ id: string; projectId: string }> | undefined;
  applications: OnboardingApplication[];
  onAssign: (id: string, projectId: string, onError: () => void) => void;
  onUnassign: (id: string, projectId: string, onError: () => void) => void;
}

export function useKanbanBoard({
  allocations,
  applications,
  onAssign,
  onUnassign,
}: UseKanbanBoardOptions) {
  const [assignments, setAssignments] = useState<Record<string, Set<string>>>(
    {},
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewingProfile, setViewingProfile] =
    useState<OnboardingApplication | null>(null);

  const initialized = useRef(false);

  // Rehydrate from DB allocations once after data loads
  useEffect(() => {
    if (initialized.current) return;
    if (!allocations || allocations.length === 0) return;

    initialized.current = true;
    const map: Record<string, Set<string>> = {};
    for (const { id, projectId } of allocations) {
      if (!map[projectId]) map[projectId] = new Set();
      map[projectId].add(id);
    }
    setAssignments(map);
  }, [allocations]);

  const assignedIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(assignments).forEach((set) =>
      set.forEach((id) => ids.add(id)),
    );
    return ids;
  }, [assignments]);

  const bench = useMemo(
    () =>
      applications.filter(
        (a) => a.status !== "rejected" && !assignedIds.has(a.id),
      ),
    [applications, assignedIds],
  );

  const activeApplication = useMemo(
    () =>
      activeId ? (applications.find((a) => a.id === activeId) ?? null) : null,
    [activeId, applications],
  );

  const dragCount =
    activeId && selectedIds.has(activeId) ? selectedIds.size : 1;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const projectId = over.id as string;
    const draggedIds = selectedIds.has(active.id as string)
      ? Array.from(selectedIds)
      : [active.id as string];

    const snapshot = { ...assignments };

    setAssignments((prev) => {
      const next: Record<string, Set<string>> = {};
      for (const pid of Object.keys(prev)) {
        const s = new Set(prev[pid]);
        if (pid !== projectId) draggedIds.forEach((id) => s.delete(id));
        next[pid] = s;
      }
      const target = new Set(next[projectId] ?? []);
      draggedIds.forEach((id) => target.add(id));
      next[projectId] = target;
      return next;
    });

    setSelectedIds(new Set());

    draggedIds.forEach((id) => {
      onAssign(id, projectId, () => setAssignments(snapshot));
    });
  };

  const handleUnassign = (projectId: string, id: string) => {
    const snapshot = { ...assignments };

    setAssignments((prev) => {
      const s = new Set(prev[projectId] ?? []);
      s.delete(id);
      return { ...prev, [projectId]: s };
    });

    onUnassign(id, projectId, () => setAssignments(snapshot));
  };

  return {
    assignments,
    selectedIds,
    setSelectedIds,
    activeId,
    viewingProfile,
    setViewingProfile,
    bench,
    activeApplication,
    dragCount,
    handleDragStart,
    handleDragEnd,
    handleUnassign,
  };
}
