# Calendar White-Box Stress Test (Mentor Dashboard)

## Objective
Validate internal branching and high-frequency state changes in the mentor dashboard calendar data flow, with emphasis on endpoint selection, converter selection, query enable/disable behavior, and stale-route protection during rapid mentee switching.

## Module Under Test
- Hook: `useCalendarEvents`
- Area: mentor dashboard calendar integration

## White-Box Focus
This test suite is white-box because assertions are derived from known internal decisions in `useCalendarEvents`:
- Role-based URL routing (student vs mentor endpoint)
- Converter selection path (student activity converter vs mentor converter)
- Query `enabled` logic when `selectedUser` is empty
- Cache/refetch interaction via query key changes and explicit invalidation/refetch

## Stress Scenarios Covered
1. Student role path:
- Uses student activity endpoint.
- Uses student converter.

2. Mentor viewing self:
- Uses mentor endpoint.
- Uses mentor converter.

3. Mentor viewing mentee:
- Uses student endpoint.
- Uses student converter.

4. Disabled query path:
- No fetch when `selectedUser` is empty.

5. Cache controls:
- Supports explicit refetch and cache invalidation flow.

6. Rapid mentee switching:
- Verifies no stale route leakage when selection changes quickly.
- Current implementation uses batched rerenders in a single `act`, which coalesces updates.

## Current Finding (Important)
In the rapid-switch test, expecting one network call per switch is incorrect under batched updates.

Observed behavior is consistent with React + React Query coalescing in this setup:
- Initial request for first render
- Final request for last selected mentee after batched rerender sequence

This means the test currently validates stale-route safety under batched state churn, not per-switch network load.

## Pass Criteria
- Endpoint and converter assertions match each role/context branch.
- Disabled query branch performs zero fetches.
- Refetch/invalidation path triggers expected additional fetch behavior.
- Rapid-switch test confirms final URL belongs to final selected mentee and no stale endpoint leakage occurs.

## Residual Risks / Gaps
- ~~True high-load in-flight race conditions are not fully simulated by a single batched rerender loop.~~
- ~~Real concurrent network overlap across many unique query keys is not stressed in the current suite.~~

## Concurrent Race Condition Test (IMPLEMENTED)
✅ **Test:** "prevents stale data overwrites with sequential rerenders and async gaps"

This test performs sequential rerenders with 50ms async gaps to force multiple in-flight fetches and verifies:
- No stale data from older requests overwrites newer selection state ✓
- Final rendered data always corresponds to the latest selected mentee ✓
- Variable network latency (responses arriving out-of-order) is handled correctly ✓

The test simulates realistic conditions where later requests resolve before earlier ones, ensuring the component maintains data integrity during rapid mentee switches.
