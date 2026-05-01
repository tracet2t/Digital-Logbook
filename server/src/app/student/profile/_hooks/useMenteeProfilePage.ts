/**
 * useMenteeProfilePage.ts
 * All state, effects, and derived data for the Mentee Profile page.
 * Returns a flat named object consumed by the page and its sub-components.
 */
"use client";

import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

import {
  getHighestSeverity,
  type ProfileApiData,
  type Task,
  type WarningSeverity,
} from "../_constants";

dayjs.extend(isToday);

export function useMenteeProfilePage() {
  const [profileData, setProfileData] = useState<ProfileApiData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warningSeverity, setWarningSeverity] =
    useState<WarningSeverity | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, tasksRes] = await Promise.all([
          fetch("/api/mentee/profile"),
          fetch("/api/student/tasks"),
        ]);

        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profileJson = await profileRes.json();
        const data = profileJson.data as ProfileApiData;
        setProfileData(data);

        // Fetch warning status to match MenteeAvatar ring
        const warningRes = await fetch(
          `/api/warningStatus?studentId=${encodeURIComponent(data.profile.id)}`,
        );
        if (warningRes.ok) {
          const warnings: { warningType: WarningSeverity | null }[] =
            await warningRes.json();
          setWarningSeverity(getHighestSeverity(warnings));
        }

        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json();
          if (Array.isArray(tasksJson)) {
            const sorted = [...tasksJson].sort((a, b) => {
              const timeA = new Date(a.createdAt ?? a.date).getTime();
              const timeB = new Date(b.createdAt ?? b.date).getTime();
              return timeB - timeA;
            });
            setTasks(sorted);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /** Approved tasks aggregated by date for the heatmap */
  const heatmapData = useMemo(() => {
    const approvedTasks = tasks.filter((task) => {
      const rawStatus = (
        task.feedback[0]?.status ??
        task.status ??
        ""
      ).toLowerCase();
      return rawStatus === "accepted" || rawStatus === "approved";
    });

    const tasksByDate: Record<string, number> = {};
    approvedTasks.forEach((task) => {
      const dateKey = dayjs(task.date).format("YYYY-MM-DD");
      tasksByDate[dateKey] = (tasksByDate[dateKey] || 0) + 1;
    });

    return Object.entries(tasksByDate).map(([date, count]) => ({
      date,
      count,
    }));
  }, [tasks]);

  /** CSS class for each heatmap cell based on task count */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getHeatmapColorClass(value: any): string {
    if (!value || value.count === 0) return "color-empty";
    if (value.count === 1) return "color-scale-3";
    if (value.count === 2) return "color-scale-5";
    return "color-scale-10";
  }

  /** Most recent task that has a mentor feedback note */
  const latestFeedback = tasks.find(
    (t) =>
      t.feedback[0]?.feedbackNotes && t.feedback[0].feedbackNotes.trim() !== "",
  );

  return {
    profileData,
    tasks,
    isLoading,
    error,
    warningSeverity,
    heatmapData,
    getHeatmapColorClass,
    latestFeedback,
  };
}
