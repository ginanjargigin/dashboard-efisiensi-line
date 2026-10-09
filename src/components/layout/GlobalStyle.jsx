import { C } from "../../constants/appConstants";
export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
          /* =========================================
   THEME: FACTORY AMBER
   Default theme
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
}
      * { box-sizing: border-box; }
            body {
        margin: 0;
        background: var(--color-bg);
        color: var(--color-text);
        transition:
          background-color 0.25s ease,
          color 0.25s ease;
      }
      :root,
      [data-theme="midnight"]
      [data-theme="factory-green"]{
        color-scheme: dark;
      }
      
      [data-theme="light"] {
        color-scheme: light;
      }
      .num-field {
        font-family: 'IBM Plex Mono', monospace;
        font-variant-numeric: tabular-nums;
      }
      /* ATURAN BARU: Mengubah background menjadi hijau transparan 50% saat input dipilih */
      .num-field-input:focus {
  background-color: var(--color-accent-soft) !important;
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 0 2px var(--color-accent-focus) !important;
}
 .note-field:focus {
  border-color: var(--color-accent) !important;
  background-color: var(--color-accent-soft) !important;
  box-shadow: 0 0 0 2px var(--color-accent-focus) !important;
}
      button:hover{
    transform:translateY(-2px);
    transition:.2s;
}

button:active{
    transform:scale(.96);
}
/* Scrollbar global */
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
  background: transparent;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: ${C.line};
  border-radius: 6px;
}


/* =========================================
   SCROLLBAR KHUSUS KATEGORI / SHEET TABS
   ========================================= */

.sheet-tabs-scroll {
  scrollbar-width: thin;
  scrollbar-color: ${C.line} transparent;
}

/* Chrome / Edge / Safari */
.sheet-tabs-scroll::-webkit-scrollbar {
  height: 6px;
  background: transparent;
}

.sheet-tabs-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sheet-tabs-scroll::-webkit-scrollbar-thumb {
  background: ${C.line};
  border-radius: 6px;
}

/* Saat pointer masuk ke area kategori */
.sheet-tabs-scroll:hover::-webkit-scrollbar-thumb {
  background: #777;
}

.sheet-tabs-scroll:hover::-webkit-scrollbar {
  height: 12px;
}

.sheet-tabs-scroll:hover::-webkit-scrollbar-track {
  background: transparent;
}

.sheet-tabs-scroll:hover::-webkit-scrollbar-thumb {
  background: #777;
  border-radius: 8px;
}

/* Saat pointer tepat di atas scrollbar */
.sheet-tabs-scroll::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}


/* LAYOUT DASHBOARD DESKTOP */
.dashboard-main-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(320px, 0.95fr);
  align-items: start;
  gap: 22px;
}

.capacity-panel {
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}


/* DASHBOARD: FILTER DAN TOMBOL DESKTOP */
.dashboard-line-select {
  width: 220px;
  flex: 0 1 220px;
}

.dashboard-month-select {
  width: 160px;
  flex: 0 0 160px;
}

.dashboard-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: auto;
  flex-wrap: nowrap;
  width: auto;
  min-width: 0;
}

.dashboard-action-button {
  height: 42px;
  width: 150px;
  flex: 0 0 150px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  border: none;
  border-radius: 9px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
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

/* MOBILE: TETAP RESPONSIF */
@media (max-width: 768px) {
  .dashboard-toolbar {
    gap: 8px !important;
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


/* TABLET DAN MOBILE: PERTAHANKAN LAYOUT LAMA */
@media (max-width: 900px) {
  .dashboard-main-layout {
    display: block;
  }

  .capacity-panel {
    display: none !important;
  }

  
/* PENYESUAIAN DROPDOWN KALKULATOR */
.capacity-panel select,
.capacity-panel input[type="date"] {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}

.capacity-panel select {
  font-size: 11px;
  padding-left: 8px;
  padding-right: 6px;
}

/* TOMBOL DASHBOARD SERAGAM */
.dashboard-action-button {
  height: 42px;
  min-height: 42px;
  width: 150px;
  flex: 0 0 150px;
  box-sizing: border-box;
}

}

      @media print {
        .no-print { display: none !important; }
        body, .print-area { background: #fff !important; color: #111 !important; }
        .print-area * { color: #111 !important; }
        .print-card { border: 1px solid #ccc !important; background: #fff !important; }
      }
    `}</style>
  );
}
