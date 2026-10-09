import { useEffect, useState } from "react";
import {
  Calculator,
  Keyboard,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "input", label: "Input", description: "Input data produksi", icon: Keyboard },
  { id: "dashboard", label: "Dashboard", description: "Monitoring efisiensi", icon: LayoutDashboard },
  { id: "capacity", label: "Kalkulator Kapasitas", description: "Hitung gabungan kapasitas line", icon: Calculator },
  { id: "settings", label: "Pengaturan", description: "Tema dan master data", icon: Settings },
];

export default function MobileNavigation({ view, setView, saveState }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const chooseView = (nextView) => {
    setView(nextView);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const saveLabel =
    saveState === "saving"
      ? "Menyimpan..."
      : saveState === "saved"
        ? "Data tersimpan"
        : saveState === "error"
          ? "Gagal menyimpan"
          : "";

  return (
    <>
      <style>{`
        :root {
          --mobile-nav-bg: #171B1E;
          --mobile-nav-panel: #22292E;
        }

        [data-theme="midnight"] {
          --mobile-nav-bg: #07101E;
          --mobile-nav-panel: #101E32;
        }

        [data-theme="factory-green"] {
          --mobile-nav-bg: #0B1916;
          --mobile-nav-panel: #142722;
        }

        [data-theme="light"] {
          --mobile-nav-bg: #17253A;
          --mobile-nav-panel: #20344F;
        }

        .mobile-navigation-shell {
          display: none;
        }

        .mobile-navigation-header {
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--color-line);
          background: var(--color-panel);
          color: var(--color-text);
        }

        .mobile-navigation-brand {
          flex: 1;
          min-width: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 21px;
          font-weight: 700;
          letter-spacing: .2px;
          white-space: nowrap;
        }

        .mobile-navigation-brand span {
          color: var(--color-accent);
        }

        .mobile-navigation-button {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-line);
          border-radius: 10px;
          background: var(--color-panel-2);
          color: var(--color-text);
          cursor: pointer;
          padding: 0;
        }

        .mobile-navigation-status {
          max-width: 94px;
          overflow: hidden;
          color: var(--color-muted);
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-navigation-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          background: rgba(0, 0, 0, .58);
          -webkit-backdrop-filter: blur(2px);
          backdrop-filter: blur(2px);
        }

        .mobile-navigation-drawer {
          width: min(86vw, 330px);
          max-width: 330px;
          height: 100%;
          height: 100dvh;
          overflow-y: auto;
          padding: 20px 16px 24px;
          background: var(--mobile-nav-bg);
          color: #F5F8FC;
          border-right: 1px solid rgba(255,255,255,.12);
          box-shadow: 18px 0 44px rgba(0,0,0,.32);
          animation: mobile-drawer-enter .18s ease-out both;
        }

        @keyframes mobile-drawer-enter {
          from { transform: translateX(-18px); opacity: .7; }
          to { transform: translateX(0); opacity: 1; }
        }

        .mobile-navigation-drawer-head {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 26px;
          padding: 4px 2px 20px;
          border-bottom: 1px solid rgba(255,255,255,.13);
        }

        .mobile-navigation-drawer-title {
          flex: 1;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.15;
        }

        .mobile-navigation-drawer-title span {
          color: var(--color-accent);
        }

        .mobile-navigation-drawer-subtitle {
          margin-top: 7px;
          color: #A9B8C9;
          font-size: 11px;
          line-height: 1.5;
        }

        .mobile-navigation-close {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 9px;
          background: rgba(255,255,255,.07);
          color: #FFFFFF;
          cursor: pointer;
        }

        .mobile-navigation-menu-label {
          margin: 0 8px 10px;
          color: #8FA4BB;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .mobile-navigation-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-navigation-item {
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #D7E2EE;
          text-align: left;
          cursor: pointer;
        }

        .mobile-navigation-item:hover {
          background: var(--mobile-nav-panel);
          transform: none;
        }

        .mobile-navigation-item.is-active {
          background: var(--color-accent);
          color: var(--color-accent-text);
          border-color: rgba(255,255,255,.12);
          box-shadow: 0 6px 18px var(--color-accent-shadow);
        }

        .mobile-navigation-item-icon {
          width: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 25px;
        }

        .mobile-navigation-item-copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .mobile-navigation-item-label {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
        }

        .mobile-navigation-item-description {
          color: currentColor;
          opacity: .72;
          font-size: 10px;
          line-height: 1.3;
        }

        .mobile-navigation-footer {
          margin-top: 24px;
          padding: 14px 10px 0;
          border-top: 1px solid rgba(255,255,255,.12);
          color: #9DAFC1;
          font-size: 11px;
          line-height: 1.5;
        }

        .mobile-navigation-save-state {
          margin-top: 7px;
          color: #C8D6E4;
          font-size: 10px;
        }

        .capacity-page {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 20px;
        }

        .capacity-page .capacity-panel {
          display: block !important;
          position: static;
          width: 100%;
          max-height: none;
          overflow: visible;
        }

        @media (max-width: 768px) {
          .desktop-navigation-shell {
            display: none !important;
          }

          .mobile-navigation-shell {
            display: block;
          }

          .capacity-page {
            padding: 14px 12px 24px;
          }
        }
      `}</style>

      <div className="mobile-navigation-shell no-print">
        <header className="mobile-navigation-header">
          <button
            type="button"
            className="mobile-navigation-button"
            onClick={() => setOpen(true)}
            aria-label="Buka navigasi"
            aria-expanded={open}
          >
            <Menu size={22} />
          </button>

          <div className="mobile-navigation-brand">
            PAPAN <span>EFISIENSI</span>
          </div>

          {saveLabel && (
            <div className="mobile-navigation-status" role="status">
              {saveLabel}
            </div>
          )}
        </header>

        {open && (
          <div
            className="mobile-navigation-overlay"
            onClick={() => setOpen(false)}
            role="presentation"
          >
            <nav
              className="mobile-navigation-drawer"
              aria-label="Navigasi utama"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mobile-navigation-drawer-head">
                <div>
                  <div className="mobile-navigation-drawer-title">
                    PAPAN <span>EFISIENSI</span>
                  </div>
                  <div className="mobile-navigation-drawer-subtitle">
                    Monitoring Produksi · Analisis
                    <br />
                    Peningkatan Efisiensi
                  </div>
                </div>

                <button
                  type="button"
                  className="mobile-navigation-close"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup navigasi"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-navigation-menu-label">
                Menu utama
              </div>

              <div className="mobile-navigation-menu">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = view === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`mobile-navigation-item${active ? " is-active" : ""}`}
                      onClick={() => chooseView(item.id)}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="mobile-navigation-item-icon">
                        <Icon size={21} strokeWidth={2} />
                      </span>
                      <span className="mobile-navigation-item-copy">
                        <span className="mobile-navigation-item-label">
                          {item.label}
                        </span>
                        <span className="mobile-navigation-item-description">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mobile-navigation-footer">
                Papan Efisiensi
                <div className="mobile-navigation-save-state" role="status">
                  {saveLabel || "Siap digunakan"}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
