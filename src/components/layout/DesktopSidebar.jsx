```jsx
import {
  Keyboard,
  LayoutDashboard,
  Settings,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";

import { C } from "../../constants/appConstants";

const MENU_ITEMS = [
  { id: "input", label: "Input", icon: Keyboard },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "capacity", label: "Kalkulator Kapasitas", icon: Calculator },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

export default function DesktopSidebar({
  view,
  setView,
  sheets,
  sheetId,
  setSheetId,
  collapsed,
  setCollapsed,
  saveState,
}) {
  const saveLabel = {
    idle: "Siap digunakan",
    saving: "Menyimpan data...",
    saved: "Data tersimpan",
    error: "Gagal menyimpan",
  }[saveState] || "";

  return (
    <aside
      className={`desktop-sidebar ${
        collapsed ? "is-collapsed" : ""
      }`}
      style={{
        "--sidebar-bg": C.panel,
        "--sidebar-border": C.line,
        "--sidebar-text": C.text,
        "--sidebar-muted": C.muted,
        "--sidebar-accent": C.amber,
      }}
    >
      <div className="desktop-sidebar-brand">
        <div className="desktop-sidebar-logo">
          <span>P</span>
        </div>

        {!collapsed && (
          <div className="desktop-sidebar-brand-text">
            <strong>
              PAPAN <span>EFISIENSI</span>
            </strong>
            <small>Production Monitoring</small>
          </div>
        )}
      </div>

      <div className="desktop-sidebar-section">
        {!collapsed && (
          <div className="desktop-sidebar-heading">
            MENU UTAMA
          </div>
        )}

        <nav aria-label="Navigasi utama">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`desktop-sidebar-item ${
                  active ? "is-active" : ""
                }`}
                onClick={() => setView(item.id)}
              >
                <Icon size={19} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="desktop-sidebar-divider" />

      <div className="desktop-sidebar-section desktop-sidebar-lines">
        {!collapsed && (
          <div className="desktop-sidebar-heading">
            DAFTAR LINE
          </div>
        )}

        <nav aria-label="Daftar line produksi">
          {sheets.map((sheet) => {
            const active = sheet.id === sheetId;

            return (
              <button
                key={sheet.id}
                type="button"
                title={collapsed ? sheet.name : undefined}
                aria-current={active ? "true" : undefined}
                className={`desktop-sidebar-item desktop-sidebar-line ${
                  active ? "is-active" : ""
                }`}
                onClick={() => {
                  setSheetId(sheet.id);
                  setView("input");
                }}
              >
                <Circle
                  size={10}
                  fill="currentColor"
                  strokeWidth={1}
                />

                {!collapsed && (
                  <span className="desktop-sidebar-line-name">
                    {sheet.name}
                  </span>
                )}

                {!collapsed && active && (
                  <span className="desktop-sidebar-current">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="desktop-sidebar-footer">
        {!collapsed && (
          <div
            className={`desktop-sidebar-save ${
              saveState === "error" ? "has-error" : ""
            }`}
            title={saveLabel}
          >
            <Circle
              size={8}
              fill="currentColor"
            />
            <span>{saveLabel}</span>
          </div>
        )}

        <button
          type="button"
          className="desktop-sidebar-collapse"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Perluas sidebar" : "Sembunyikan sidebar"}
          aria-label={collapsed ? "Perluas sidebar" : "Sembunyikan sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Sembunyikan</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
```
