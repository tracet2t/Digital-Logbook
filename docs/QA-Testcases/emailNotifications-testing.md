# Email Notifications Testing (Mentor)

## Test File
- test/mentor/emailNotifications.test.ts

## Run This Test Only
```bash
cd /home/nasrin/logbook/Digital-Logbook/server
npm test -- test/mentor/emailNotifications.test.ts
```

## Current Coverage
- Sends registration email with expected transport and payload.
- Throws expected error when sendMail fails.

## Notes
- Mock path for EmailTemplate should be: ../../src/components/EmailTemplate/EmailTemplate
- Deprecation warning for punycode does not fail the test suite.

## TODO
- Add edge-case tests for missing env vars.
- Add test for invalid recipient email.
- Add test for html/template rendering fallback behavior.
