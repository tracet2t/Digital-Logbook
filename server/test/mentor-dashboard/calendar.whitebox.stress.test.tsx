import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import {
  convertToCalendarEvents,
  convertToCalendarEventsMentor,
} from "@/lib/calenderUtils";

jest.mock("@/lib/calenderUtils", () => ({
  convertToCalendarEvents: jest.fn(),
  convertToCalendarEventsMentor: jest.fn(),
}));

const mockConvertToCalendarEvents =
  convertToCalendarEvents as jest.MockedFunction<typeof convertToCalendarEvents>;
const mockConvertToCalendarEventsMentor =
  convertToCalendarEventsMentor as jest.MockedFunction<
    typeof convertToCalendarEventsMentor
  >;

type FetchResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const makeWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "QueryClientTestWrapper";

  return Wrapper;
};

describe("Mentor Calendar White-Box Stress", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn(async (url: string) => {
      const payload = [{ date: "2026-03-15", notes: `payload:${url}` }];
      return {
        ok: true,
        json: async () => payload,
      } as FetchResponse as Response;
    }) as jest.Mock;

    mockConvertToCalendarEvents.mockImplementation((data) => {
      const first = data[0] as { date: string; notes?: string };
      return [
        {
          id: "evt-1",
          title: first?.notes || "student-event",
          start: new Date(first?.date || "2026-03-15"),
          end: new Date(first?.date || "2026-03-15"),
          createdAt: new Date("2026-03-15"),
          studentId: "student-1",
          status: "pending" as const,
        },
      ];
    });

    mockConvertToCalendarEventsMentor.mockImplementation((data) => {
      const first = data[0] as { date: string; activities?: string };
      return [
        {
          id: "evt-mentor-1",
          title: first?.activities || "mentor-event",
          start: new Date(first?.date || "2026-03-15"),
          end: new Date(first?.date || "2026-03-15"),
          createdAt: new Date("2026-03-15"),
          studentId: "mentor-1",
          status: "approved" as const,
        },
      ];
    });
  });

  it("uses student activity endpoint and student converter for student role", async () => {
    const queryClient = makeQueryClient();

    const { result } = renderHook(
      () => useCalendarEvents("student-77", "student", "student-77"),
      {
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/activity?studentId=student-77",
    );
    expect(mockConvertToCalendarEvents).toHaveBeenCalledTimes(1);
    expect(mockConvertToCalendarEventsMentor).not.toHaveBeenCalled();
  });

  it("uses mentor endpoint and mentor converter when mentor views self", async () => {
    const queryClient = makeQueryClient();

    const { result } = renderHook(
      () => useCalendarEvents("mentor-9", "mentor", "mentor-9"),
      {
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/mentor?studentId=mentor-9",
    );
    expect(mockConvertToCalendarEventsMentor).toHaveBeenCalledTimes(1);
    expect(mockConvertToCalendarEvents).not.toHaveBeenCalled();
  });

  it("uses student endpoint and student converter when mentor views mentee", async () => {
    const queryClient = makeQueryClient();

    const { result } = renderHook(
      () => useCalendarEvents("mentor-9", "mentor", "student-22"),
      {
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/student?studentId=student-22",
    );
    expect(mockConvertToCalendarEvents).toHaveBeenCalledTimes(1);
    expect(mockConvertToCalendarEventsMentor).not.toHaveBeenCalled();
  });

  it("does not fetch when selectedUser is empty (query disabled)", async () => {
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useCalendarEvents("mentor-9", "mentor", ""), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("supports explicit refetch and cache invalidation", async () => {
    const queryClient = makeQueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useCalendarEvents("mentor-42", "mentor", "student-42"),
      {
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.refetchEvents();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    act(() => {
      result.current.invalidateCalendarCache();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["calendarEvents", "mentor-42", "mentor", "student-42"],
    });
  });

  it("handles rapid mentee switching without stale route leakage", async () => {
    const queryClient = makeQueryClient();

    const { rerender } = renderHook(
      ({ selectedUser }) => useCalendarEvents("mentor-primary", "mentor", selectedUser),
      {
        initialProps: { selectedUser: "student-0" },
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      for (let i = 1; i <= 60; i += 1) {
        rerender({ selectedUser: `student-${i}` });
      }
    });

    await waitFor(() => {
      // Rapid rerenders in one act are coalesced, so we expect initial + final fetch.
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    const calledUrls = (global.fetch as jest.Mock).mock.calls.map(
      (call) => call[0] as string,
    );

    expect(
      calledUrls.every((url) => url.startsWith("http://localhost:3000/api/student?studentId=")),
    ).toBe(true);
    expect(calledUrls).toContain("http://localhost:3000/api/student?studentId=student-0");
    expect(calledUrls).toContain("http://localhost:3000/api/student?studentId=student-60");
  });

  it("prevents stale data overwrites with sequential rerenders and async gaps", async () => {
    const queryClient = makeQueryClient();
    const fetchCallOrder: string[] = [];

    global.fetch = jest.fn(async (url: string) => {
      fetchCallOrder.push(url);
      // Simulate variable network latency: later requests resolve faster
      const latency = 100 * (6 - parseInt(url.match(/student-(\d+)/)?.[1] || "0", 10));
      await new Promise((resolve) => setTimeout(resolve, latency));

      const payload = [{ date: "2026-03-15", notes: `payload:${url}` }];
      return {
        ok: true,
        json: async () => payload,
      } as FetchResponse as Response;
    }) as jest.Mock;

    const { rerender, result } = renderHook(
      ({ selectedUser }) => useCalendarEvents("mentor-primary", "mentor", selectedUser),
      {
        initialProps: { selectedUser: "student-1" },
        wrapper: makeWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Sequential rerenders with async gaps to force in-flight fetches
    for (let i = 2; i <= 5; i += 1) {
      await act(async () => {
        rerender({ selectedUser: `student-${i}` });
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
    }

    // Wait for all pending requests to settle
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledTimes(5);
      },
      { timeout: 1000 },
    );

    // Verify fetch was called for each student in order
    expect(fetchCallOrder).toHaveLength(5);
    expect(fetchCallOrder[0]).toContain("student-1");
    expect(fetchCallOrder[1]).toContain("student-2");
    expect(fetchCallOrder[2]).toContain("student-3");
    expect(fetchCallOrder[3]).toContain("student-4");
    expect(fetchCallOrder[4]).toContain("student-5");

    // Final state should reflect the latest selected mentee (student-5)
    // even if earlier requests resolve after later ones
    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    const finalEventTitle = result.current.events[0]?.title;
    expect(finalEventTitle).toContain("student-5");
  });
});
