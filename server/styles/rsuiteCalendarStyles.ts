const rsuiteCalendarStyles = `
    .rs-calendar-table-cell {
        border: 1px solid #e2e8f0 !important;
        vertical-align: top !important;
    }
    .rs-calendar-table-cell-content {
        height: 90px !important;
        padding: 4px 6px !important;
        display: flex !important;
        flex-direction: column !important;
    }
    .rs-calendar-table-cell-day {
        font-size: 13px !important;
        font-weight: 600 !important;
        color: #374151 !important;
        align-self: flex-end !important;
        margin-bottom: 4px !important;
    }
    .rs-calendar-table-header-cell {
        border: 1px solid #e2e8f0 !important;
        background-color: #f8fafc !important;
        font-weight: 700 !important;
        padding: 8px !important;
    }
    .rs-calendar-table-cell-un-same-month .rs-calendar-table-cell-day {
        color: #cbd5e1 !important;
    }
    .rs-calendar-table-cell-is-today .rs-calendar-table-cell-day {
        background-color: #3b82f6 !important;
        color: white !important;
        border-radius: 50% !important;
        width: 24px !important;
        height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        align-self: flex-end !important;
        margin-left: auto !important;
        margin-right: 0 !important;
    }
    .rs-calendar-table-cell-is-today .rs-calendar-table-cell-content {
        align-items: flex-end !important;
    }
    .rs-calendar-table-row > .rs-calendar-table-cell:nth-child(6),
    .rs-calendar-table-row > .rs-calendar-table-cell:nth-child(7) {
        background-color: #fee2e2 !important;
    }
    .rs-calendar-table-header-row > .rs-calendar-table-header-cell:nth-child(6),
    .rs-calendar-table-header-row > .rs-calendar-table-header-cell:nth-child(7) {
        background-color: #fecaca !important;
    }
    .rs-calendar {
        width: 100% !important;
        overflow: hidden !important;
    }
    .rs-calendar-table {
        width: 100% !important;
        table-layout: fixed !important;
    }
    .rs-calendar-table-cell,
    .rs-calendar-table-header-cell {
        width: calc(100% / 7) !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }
`;

export default rsuiteCalendarStyles;
