"use client";

import { useEffect, useState } from "react";

import { formatDisplayDate, type ReportRow } from "./types";

// Fetches report rows from the API and formats dates for display
export function useReportsData() {
  const [tableRows, setTableRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setIsLoading(true);
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
        if (!mounted) return;
        setTableRows(
          Array.isArray(data)
            ? data.map((row) => ({
                ...row,
                date: formatDisplayDate(row.rawDate),
              }))
            : [],
        );
      } catch (error) {
        if (!mounted) return;
        setTableRows([]);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to fetch project data",
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return { tableRows, isLoading, fetchError };
}
