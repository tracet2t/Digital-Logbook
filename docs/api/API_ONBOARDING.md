# Onboarding API

Base route: /api/onboarding

## POST /api/onboarding
Creates a new onboarding application.

Required fields:
- fullName
- email
- university
- degreeProgram
- cvLink

Success response:
- Status: 201
- Body: message and application object

Validation and error responses:
- 400: missing required fields
- 409: email already exists
- 500: internal server error

## GET /api/onboarding
Fetches onboarding applications.

Supported query params:
- summary=true: returns application counts by status
- id=<applicationId>: returns one application by id
- email=<emailAddress>: returns one application by email
- status=pending|approved|rejected: returns applications by status
- search=<text>: text search across applications
- startDate=<ISO date>&endDate=<ISO date>: date range filter

Validation and error responses:
- 400: invalid status, missing date pair, or invalid date format
- 404: application not found (id or email)
- 500: internal server error

## PATCH /api/onboarding
Updates onboarding application status.

Required body fields:
- id
- status (pending | approved | rejected)

Authorization:
- Requires authenticated session
- Requires superAdmin role

Validation and error responses:
- 401: unauthorized
- 403: forbidden (non-superAdmin)
- 400: invalid payload or status
- 404: application not found
- 500: internal server error

## Jest Test Command
From server directory:

npm test -- test/onboarding/onboarding.api.test.ts

## Related Files
- server/src/app/api/onboarding/route.ts
- server/test/onboarding/onboarding.api.test.ts
