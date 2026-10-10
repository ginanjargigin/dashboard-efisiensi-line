import { C } from "../../constants/appConstants";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

      /* =========================================
         THEME: FACTORY AMBER
      ========================================= */

      :root {
        --color-bg: #1A1D20;
        --color-panel: #232729;
        --color-panel-2: #2B3033;
        --color-line: #383E42;

        --color-accent: #F2A93B;
        --color-accent-soft: rgba(242, 169, 59, 0.12);
        --color-accent-focus: rgba(242, 169, 59, 0.18);
        --color-accent-shadow: rgba(242, 169, 59, 0.30);

        --color-input: #2B3033;
        --color-card-shadow: rgba(0, 0, 0, 0.20);
        --color-accent-text: #1A1D20;
        --color-hover: rgba(255, 255, 255, 0.04);

        --color-steel: #6C93B0;
        --color-text: #ECEEEF;
        --color-muted: #8C949A;
      }

      /* =========================================
         THEME: MIDNIGHT CYAN
      ========================================= */

      [data-theme="midnight"] {
        --color-bg: #0B1220;
        --color-panel: #111B2D;
        --color-panel-2: #17243A;
        --color-line: #2B3B50;

        --color-accent: #38BDF8;
        --color-accent-soft: rgba(56, 189, 248, 0.12);
        --color-accent-focus: rgba(56, 189, 248, 0.18);
        --color-accent-shadow: rgba(56, 189, 248, 0.30);

        --color-input: #17243A;
        --color-card-shadow: rgba(0, 0, 0, 0.35);
        --color-accent-text: #06131A;
        --color-hover: rgba(125, 211, 252, 0.06);

        --color-steel: #7DD3FC;
        --color-text: #E6F4FF;
        --color-muted: #94A9BD;
      }

      /* =========================================
         THEME: FACTORY GREEN
      ========================================= */

      [data-theme="factory-green"] {
        --color-bg: #10191B;
        --color-panel: #192426;
        --color-panel-2: #202D2F;
        --color-line: #334447;

        --color-accent: #20B486;
        --color-accent-soft: rgba(32, 180, 134, 0.12);
        --color-accent-focus: rgba(32, 180, 134, 0.18);
        --color-accent-shadow: rgba(32, 180, 134, 0.25);

        --color-input: #202D2F;
        --color-card-shadow: rgba(0, 0, 0, 0.28);
        --color-accent-text: #071613;
        --color-hover: rgba(32, 180, 134, 0.06);

        --color-steel: #6FA99A;
        --color-text: #E8F2EF;
        --color-muted: #91A19E;
      }

      /* =========================================
         THEME: LIGHT CORPORATE
      ========================================= */

      [data-theme="light"] {
        --color-bg: #F3F5F7;
        --color-panel: #FFFFFF;
        --color-panel-2: #EEF1F4;
        --color-line: #D8DEE5;

        --color-accent: #2563EB;
        --color-accent-soft: rgba(37, 99, 235, 0.10);
        --color-accent-focus: rgba(37, 99, 235, 0.16);
        --color-accent-shadow: rgba(37, 99, 235, 0.22);

        --color-input: #F8FAFC;
        --color-card-shadow: rgba(15, 23, 42, 0.08);
        --color-accent-text: #FFFFFF;
        --color-hover: rgba(37, 99, 235, 0.05);

        --color-steel: #47718F;
        --color-text: #18212B;
        --color-muted: #687481;
      }

      /* =========================================
         GLOBAL
      ========================================= */

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--color-bg);
        color: var(--color-text);
        font-family: Inter, sans-serif;
        transition:
          background-color 0.25s ease,
          color 0.25s ease;
      }

      :root,
      [data-theme="midnight"],
      [data-theme="factory-green"] {
        color-scheme: dark;
      }

      [data-theme="light"] {
        color-scheme: light;
      }

      .num-field {
        font-family: 'IBM Plex Mono', monospace;
        font-variant-numeric: tabular-nums;
      }

      /* =========================================
         INPUT FOCUS
      ========================================= */

      .num-field-input:focus,
      .note-field:focus {
        background-color: var(--color-accent-soft) !important;
        border-color: var(--color-accent) !important;
        box-shadow: 0 0 0 2px var(--color-accent-focus) !important;
      }

      /* =========================================
         BUTTON INTERACTION
      ========================================= */

      button {
        transition:
          transform 0.2s ease,
          filter 0.2s ease;
      }

      button:hover {
        transform: translateY(-2px);
      }

      button:active {
        transform: scale(0.96);
      }

      /* =========================================
         GLOBAL SCROLLBAR
      ========================================= */

      ::-webkit-scrollbar {
        height: 6px;
        width: 6px;
        background: transparent;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: var(--color-line, ${C.line});
        border-radius: 6px;
      }

      /* =========================================
         SHEET TABS SCROLLBAR
      ========================================= */

      .sheet-tabs-scroll {
        scrollbar-width: thin;
        scrollbar-color: var(--color-line, ${C.line}) transparent;
      }

      .sheet-tabs-scroll::-webkit-scrollbar {
        height: 6px;
        background: transparent;
      }

      .sheet-tabs-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .sheet-tabs-scroll::-webkit-scrollbar-thumb {
        background: var(--color-line, ${C.line});
        border-radius: 6px;
      }

      .sheet-tabs-scroll:hover::-webkit-scrollbar {
        height: 12px;
      }

      .sheet-tabs-scroll:hover::-webkit-scrollbar-thumb {
        background: #777;
        border-radius: 8px;
      }

      .sheet-tabs-scroll::-webkit-scrollbar-thumb:hover {
        background: #AAA;
      }

      /* =========================================
         DASHBOARD LAYOUT
      ========================================= */

      .dashboard-main-layout {
        display: grid;
        grid-template-columns:
          minmax(0, 1.85fr)
          minmax(320px, 0.95fr);
        align-items: start;
        gap: 22px;
        min-width: 0;
      }

      .dashboard-main-layout > section {
        min-width: 0;
      }

      .capacity-panel {
        position: sticky;
        top: 16px;
        min-width: 0;
        max-height: calc(100vh - 32px);
        overflow-y: auto;
      }

      /* =========================================
         DASHBOARD FILTERS
      ========================================= */

      .dashboard-toolbar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      .dashboard-line-select {
        width: 220px;
        flex: 0 1 220px;
        min-width: 0;
      }

      .dashboard-month-select {
        width: 160px;
        flex: 0 0 160px;
        min-width: 0;
      }

      /* =========================================
         DASHBOARD ACTION BUTTONS
      ========================================= */

      .dashboard-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        margin-left: auto;
        width: auto;
        min-width: 0;
        flex-wrap: nowrap;
      }

      .dashboard-action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        width: 150px;
        height: 42px;
        min-height: 42px;
        flex: 0 0 150px;

        box-sizing: border-box;
        padding: 0 12px;
        border: none;
        border-radius: 9px;

        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
      }

      .dashboard-export-button {
        background: #16A34A;
        color: #FFFFFF;
      }

      .dashboard-print-button {
        background: #38BDF8;
        color: #0B1220;
      }

      .dashboard-action-button:hover {
        filter: brightness(1.08);
      }

      /* =========================================
         CAPACITY PANEL INPUTS
      ========================================= */

      .capacity-panel select,
      .capacity-panel input[type="date"] {
        display: block;
        width: 100%;
        min-width: 0;
        max-width: 100%;
        height: 42px;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 11px;
      }

      .capacity-panel select {
        padding-left: 8px;
        padding-right: 6px;
        text-overflow: ellipsis;
      }

      .capacity-panel input[type="date"] {
        padding-right: 8px;
      }

      /* =========================================
         TABLET
      ========================================= */

      @media (max-width: 900px) {
        .dashboard-main-layout {
          display: block;
        }

        .capacity-panel {
          display: none !important;
        }
      }

      /* =========================================
         MOBILE
      ========================================= */

      @media (max-width: 768px) {
        .dashboard-toolbar {
          gap: 8px;
        }

        .dashboard-line-select {
          width: auto;
          flex: 1 1 180px;
        }

        .dashboard-month-select {
          width: auto;
          flex: 1 1 140px;
        }

        .dashboard-actions {
          justify-content: flex-start;
          margin-left: 0;
          width: 100%;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dashboard-action-button {
          width: auto;
          flex: 1 1 150px;
          max-width: 180px;
        }
      }
              
      /* =========================================
         DESKTOP SIDEBAR
      ========================================= */
      
      .desktop-app-layout {
        display: grid;
        grid-template-columns: 238px minmax(0, 1fr);
        min-height: 100vh;
        transition: grid-template-columns 0.2s ease;
      }
      
      .desktop-app-layout.sidebar-collapsed {
        grid-template-columns: 72px minmax(0, 1fr);
      }
      
      .desktop-sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow: hidden;
        background: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        z-index: 20;
      }
      
      .desktop-sidebar-brand {
        min-height: 76px;
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .desktop-sidebar-logo {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: var(--sidebar-accent);
        color: var(--color-accent-text);
        font-size: 20px;
        font-weight: 800;
      }
      
      .desktop-sidebar-brand-text {
        min-width: 0;
        overflow: hidden;
      }
      
      .desktop-sidebar-brand-text strong {
        display: block;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 19px;
        white-space: nowrap;
      }
      
      .desktop-sidebar-brand-text strong span {
        color: var(--sidebar-accent);
      }
      
      .desktop-sidebar-brand-text small {
        display: block;
        margin-top: 4px;
        color: var(--sidebar-muted);
        font-size: 10px;
      }
      
      .desktop-sidebar-section {
        padding: 16px 10px 8px;
      }
      
      .desktop-sidebar-heading {
        padding: 0 10px;
        margin-bottom: 10px;
        color: var(--sidebar-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
      }
      
      .desktop-sidebar-item {
        width: 100%;
        min-height: 43px;
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 0 12px;
        margin-bottom: 5px;
        border: 1px solid transparent;
        border-radius: 9px;
        background: transparent;
        color: var(--sidebar-muted);
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
      }
      
      .desktop-sidebar-item:hover {
        background: var(--color-hover);
        color: var(--sidebar-text);
        transform: none;
      }
      
      .desktop-sidebar-item.is-active {
        background: var(--color-accent-soft);
        border-color: var(--sidebar-accent);
        color: var(--sidebar-accent);
      }
      
      .desktop-sidebar-item > svg {
        flex: 0 0 19px;
      }
      
      .desktop-sidebar-divider {
        height: 1px;
        margin: 4px 16px;
        background: var(--sidebar-border);
      }
      
      .desktop-sidebar-lines {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }
      
      .desktop-sidebar-line {
        min-height: 37px;
        gap: 10px;
        font-size: 12px;
      }
      
      .desktop-sidebar-line-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .desktop-sidebar-current {
        font-size: 10px;
        font-weight: 700;
      }
      
      .desktop-sidebar-footer {
        padding: 10px;
        border-top: 1px solid var(--sidebar-border);
      }
      
      .desktop-sidebar-save {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 5px 12px;
        color: var(--sidebar-muted);
        font-size: 10px;
      }
      
      .desktop-sidebar-save.has-error {
        color: var(--color-bad, #E5555C);
      }
      
      .desktop-sidebar-collapse {
        width: 100%;
        min-height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid var(--sidebar-border);
        border-radius: 8px;
        background: transparent;
        color: var(--sidebar-muted);
        cursor: pointer;
      }
      
      .desktop-sidebar-collapse:hover {
        background: var(--color-hover);
        transform: none;
      }
      
      .desktop-app-content {
        min-width: 0;
        overflow-x: clip;
      }
      
      .desktop-app-layout .sheet-tabs-shell {
        display: none;
      }
      
      .desktop-app-layout .desktop-navigation-shell {
        display: none;
      }
      
      .desktop-app-layout .desktop-sidebar.is-collapsed {
        width: 72px;
      }
      
      /* =========================================
         RESPONSIVE
      ========================================= */
      
      @media (max-width: 768px) {
        .desktop-app-layout {
          display: block;
          min-height: 0;
        }
      
        .desktop-app-layout > .desktop-sidebar {
          display: none;
        }
      
        .desktop-app-content {
          overflow: visible;
        }
      
        .desktop-app-layout .sheet-tabs-shell {
          display: block;
        }
      }

      /* =========================================
         PRINT
      ========================================= */

      @media print {
        .no-print {
          display: none !important;
        }

        body,
        .print-area {
          background: #FFFFFF !important;
          color: #111111 !important;
        }

        .print-area * {
          color: #111111 !important;
        }

        .print-card {
          border: 1px solid #CCCCCC !important;
          background: #FFFFFF !important;
        }

        .dashboard-main-layout {
          display: block !important;
        }

        .capacity-panel {
          display: none !important;
        }
      
/* =========================================
   INPUT PAGE: DESKTOP TWO-COLUMN LAYOUT
========================================= */

.input-view-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  align-items: start;
  gap: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.input-view-left,
.input-view-right {
  min-width: 0;
}

.input-view-right {
  position: sticky;
  top: 16px;
}

/* Grafik dan panel mengikuti lebar kolom */
.input-view-right > * {
  min-width: 0;
  max-width: 100%;
}

/* Tablet dan HP */
@media (max-width: 900px) {
  .input-view-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .input-view-right {
    position: static;
  }
}

@media (max-width: 768px) {
  .input-view-layout {
    gap: 16px;
    padding: 14px;
  }
}

      
      }
      
    `}</style>
  );
}
