import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { OnboardingApplication } from "./useAdminOnboarding";

// Types

/** The type of assignment action being confirmed */
export type KanbanActionType = "assign" | "reassign" | "unassign";

/** Pending action queued while waiting for user confirmation */
export interface KanbanPendingAction {
  type: KanbanActionType;
  /** IDs of the users being moved (single or multi-select) */
  draggedIds: string[];
  /** Project the user is coming FROM (null = bench) */
  sourceProjectId: string | null;
  /** Project the user is going TO (null = bench / unassign) */
  targetProjectId: string | null;
  /** Snapshot of assignments used to revert on cancel */
  snapshot: Record<string, Set<string>>;
}

interface UseKanbanBoardOptions {
  allocations: Array<{ id: string; projectId: string }> | undefined;
  applications: OnboardingApplication[];
  onAssign: (id: string, projectId: string, onError: () => void) => void;
  onUnassign: (id: string, projectId: string, onError: () => void) => void;
}

// Hook

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

  /** The action waiting for confirmation. Null means no dialog is open. */
  const [pendingAction, setPendingAction] =
    useState<KanbanPendingAction | null>(null);

  const initialized = useRef(false);
  // Always-fresh ref so event handlers never read stale closure state
  const assignmentsRef = useRef(assignments);
  useEffect(() => {
    assignmentsRef.current = assignments;
  });

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
        (a) =>
          (a.status === "pending" ||
            a.status === "inactive" ||
            a.status === "approved") &&
          !assignedIds.has(a.id),
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

  // Drag handlers — queue action, don't apply optimistically

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    const id = active.id as string;
    const current = assignmentsRef.current;

    // Find which project the dragged item is currently in (null = bench)
    let sourceProjectId: string | null = null;
    for (const [pid, members] of Object.entries(current)) {
      if ((members as Set<string>).has(id)) {
        sourceProjectId = pid;
        break;
      }
    }

    const targetId = over?.id as string | undefined;

    // ── Return to bench ──
    if (sourceProjectId && (!targetId || targetId === "BENCH")) {
      setPendingAction({
        type: "unassign",
        draggedIds: [id],
        sourceProjectId,
        targetProjectId: null,
        snapshot: { ...current },
      });
      return;
    }

    // Dropped on nothing while already on bench → ignore
    if (!targetId) return;

    // Dropped on the same project it's already in → ignore
    if (sourceProjectId === targetId) return;

    // ── Assign or reassign ──
    const draggedIds = selectedIds.has(id) ? Array.from(selectedIds) : [id];

    setPendingAction({
      type: sourceProjectId ? "reassign" : "assign",
      draggedIds,
      sourceProjectId,
      targetProjectId: targetId,
      snapshot: { ...current },
    });
  };

  // ── Unassign via the ✕ button inside a project card ──
  const handleUnassign = (projectId: string, id: string) => {
    setPendingAction({
      type: "unassign",
      draggedIds: [id],
      sourceProjectId: projectId,
      targetProjectId: null,
      snapshot: { ...assignments },
    });
  };

  // Confirm / Cancel

  const confirmPendingAction = useCallback(() => {
    if (!pendingAction) return;

    const { type, draggedIds, sourceProjectId, targetProjectId, snapshot } =
      pendingAction;

    if (type === "unassign" && sourceProjectId) {
      // Optimistic UI update
      setAssignments((prev) => {
        const s = new Set(prev[sourceProjectId] ?? []);
        draggedIds.forEach((did) => s.delete(did));
        return { ...prev, [sourceProjectId]: s };
      });
      draggedIds.forEach((did) =>
        onUnassign(did, sourceProjectId, () => setAssignments(snapshot)),
      );
    } else if (targetProjectId) {
      // assign or reassign
      setAssignments((prev) => {
        const next: Record<string, Set<string>> = {};
        for (const pid of Object.keys(prev)) {
          const s = new Set(prev[pid]);
          if (pid !== targetProjectId)
            draggedIds.forEach((did) => s.delete(did));
          next[pid] = s;
        }
        const target = new Set(next[targetProjectId] ?? []);
        draggedIds.forEach((did) => target.add(did));
        next[targetProjectId] = target;
        return next;
      });
      draggedIds.forEach((did) =>
        onAssign(did, targetProjectId, () => setAssignments(snapshot)),
      );
    }

    setSelectedIds(new Set());
    setPendingAction(null);
  }, [pendingAction, onAssign, onUnassign]);

  const cancelPendingAction = useCallback(() => {
    // No optimistic update was applied, so nothing to revert.
    setSelectedIds(new Set());
    setPendingAction(null);
  }, []);

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
    // Confirmation dialog state
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
  };
}
