"use client";

import { useCallback, useEffect, useState } from "react";

import { formatDisplayDate, type ReportRow } from "./types";

const POLL_INTERVAL_MS = 30_000;

// Fetches report rows from the API and formats dates for display.
// Auto-refreshes every 30 seconds to pick up newly added projects.
export function useReportsData() {
  const [tableRows, setTableRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/reports", { cache: "no-store" });
      if (!res.ok) {
        const payload = await res
          .json()
          .catch(() => ({ message: "Failed to fetch project data" }));
        throw new Error(payload.message ?? "Failed to fetch project data");
      }
      const data = (await res.json()) as ReportRow[];
      setTableRows(
        Array.isArray(data)
          ? data.map((row) => ({
              ...row,
              date: formatDisplayDate(row.rawDate),
            }))
          : [],
      );
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Failed to fetch project data",
      );
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Poll for new projects in the background without showing the loading spinner
  useEffect(() => {
    const interval = setInterval(() => loadData(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  return { tableRows, isLoading, fetchError };
}
