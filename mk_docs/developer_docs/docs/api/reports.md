# Reports API

Generate and retrieve mentor activity reports. Reports are created **asynchronously** using a background job queue.

!!! note "Auth Required"
    All endpoints require a valid JWT cookie. Mentors can only access their own reports.

---

## GET `/api/reports`

Retrieve a list of reports.

**Auth:** Super Admin or Mentor

### Response

```json
[
  {
    "id": "report-uuid",
    "mentorId": "mentor-uuid",
    "reportData": {},
    "status": "completed",
    "generatedAt": "2026-01-20T09:00:00Z"
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique report identifier |
| `mentorId` | UUID | The mentor who generated this report |
| `reportData` | JSON | The actual report content |
| `status` | string | `pending`, `wip`, `completed`, or `error` |
| `generatedAt` | ISO 8601 | When the report was created |

### Report Status Values

| Status | Meaning |
|---|---|
| `pending` | Report is queued but not started |
| `wip` | Report is currently being generated |
| `completed` | Report is ready and can be downloaded |
| `error` | Report generation failed |

---

## POST `/api/reports`

Request generation of a new report.

**Auth:** Mentor only

### Request Body

```json
{
  "mentorId": "mentor-uuid",
  "dateFrom": "2026-01-01",
  "dateTo": "2026-01-31"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `mentorId` | string | ✅ | The mentor's ID |
| `dateFrom` | string | ❌ | Start date filter (ISO 8601 date) |
| `dateTo` | string | ❌ | End date filter (ISO 8601 date) |

### Response

```json
{
  "success": true,
  "message": "Report generation queued",
  "reportId": "report-uuid"
}
```

!!! tip "Async Generation"
    Reports are generated in the background via BullMQ. Poll the GET endpoint and check `status` — when it's `"completed"`, the report is ready.
    See [Special Logic](../special-logic.md) for how the queue works.

---

## Error Responses

| Status | Message | Cause |
|---|---|---|
| `403` | `"Access denied"` | Not a mentor or admin |
| `404` | `"Report not found"` | Invalid report ID |
| `500` | `"Report generation failed"` | Queue or processing error |

---

## Related Pages

- [Reports Feature](../features/reports.md) — How reports work in the UI
- [Special Logic](../special-logic.md) — BullMQ and async report queue
- [Database Schema](../database.md) — Reports model definition
