# Mentor Combobox Testing

## Test File
- test/mentor/mentor-combobox.test.tsx

## Run This Test Only
```bash
cd /home/nasrin/logbook/Digital-Logbook/server
npm test -- test/mentor/mentor-combobox.test.tsx
```

## Test Cases Covered
- Shows placeholder when no value is selected.
- Opens combobox and displays all items.
- Filters items using search input.
- Calls `onValueChange` and closes after selection.
- Shows selected value on combobox trigger.
- Closes when clicking outside.
- Renders custom item content with `renderItem`.

## Notes
- Update this file when adding new mentor combobox behaviors.
- Add edge cases here (empty items, keyboard navigation, disabled state).
