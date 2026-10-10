import DesktopSidebar from "./src/components/layout/DesktopSidebar";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { initializeDb } from "./src/services/dbService";
import { saveDbToSupabase } from "./src/services/supabaseWriteService";
import { createSaveScheduler } from "./src/services/saveService";

import { C } from "./src/constants/appConstants";

import {
  todayISO,
  monthKeyOf,
} from "./src/utils/appUtils";

import { exportDbCsv as createCsvExport } from "./src/utils/csvUtils";
import { useAppActions } from "./src/hooks/useAppActions";
import SheetTabs from "./src/components/layout/SheetTabs";
import InputView from "./src/components/input/InputView";
import SettingsView from "./src/components/settings/SettingsView";
import TopBar from "./src/components/layout/TopBar";
import DashboardView from "./src/components/dashboard/DashboardView";
import CapacityPanel from "./src/components/dashboard/CapacityPanel";
import MobileNavigation from "./src/components/layout/MobileNavigation";
import GlobalStyle from "./src/components/layout/GlobalStyle";

import {
  AlertTriangle,
} from "lucide-react";

/* ----------------------------------- App ------------------------------------- */

export default function App() {
  const [db, setDb] = useState(null);
  const [sheetId, setSheetId] = useState(null);
  const [date, setDate] = useState(todayISO());
  const [view, setView] = useState("input");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
  () => localStorage.getItem("papan-sidebar-collapsed") === "true"
);

useEffect(() => {
  localStorage.setItem(
    "papan-sidebar-collapsed",
    String(sidebarCollapsed)
  );
}, [sidebarCollapsed]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("papan-theme") || "amber"
  );
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveState, setSaveState] = useState("idle");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("papan-theme", theme);
  }, [theme]);

  const mk = monthKeyOf(date);

  useEffect(() => {
    (async () => {
      try {
        const remote = await initializeDb();
        setDb(remote);
        setSheetId(remote.sheets[0].id);
        setReady(true);
      } catch (e) {
        console.error("Supabase connection error:", e);

        const message =
          e?.message ||
          "Tidak dapat terhubung ke database Supabase. Periksa koneksi internet.";

        setLoadError(message);
        setReady(true);
      }
    })();
  }, []);

  const saveDbToSupabaseOnly = async (nextDb) => {
    const october = nextDb?.months?.["2026-10"] || {};

    console.log(
      "SAVE DEBUG 2026-10-01:",
      Object.entries(october).map(([id, sheetData]) => ({
        sheetId: id,
        data: sheetData?.["2026-10-01"],
      }))
    );

    await saveDbToSupabase(nextDb);
    console.log("SUPABASE PRIMARY SAVE: SUCCESS");
  };

  const saveSchedulerRef = useRef(null);

  if (!saveSchedulerRef.current) {
    saveSchedulerRef.current = createSaveScheduler({
      saveDb: saveDbToSupabaseOnly,
      setSaveState,
      delay: 600,
    });
  }

  const scheduleSave = (nextDb) => {
    saveSchedulerRef.current.schedule(nextDb);
  };

  useEffect(() => {
    return () => {
      saveSchedulerRef.current?.cancel();
    };
  }, []);

  const exportDbCsv = () => {
    createCsvExport(db, todayISO());
  };

  const monthData = (db && db.months[mk]) || {};

  const {
    updateEntry,
    updateNgEntry,
    updateNote,
    clearEntry,
    addSheet,
    removeSheet,
    updateSheetName,
    addMetric,
    updateMetric,
    removeMetric,
    moveSheet,
    addNgType,
    updateNgType,
    removeNgType,
  } = useAppActions({
    setDb,
    setSheetId,
    sheetId,
    mk,
    scheduleSave,
    saveScheduler: saveSchedulerRef.current,
  });

  if (!ready || (!db && !loadError)) {
    return (
      <div
        style={{
          background: C.bg,
          color: C.text,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Memuat papan efisiensi…
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        style={{
          background: C.bg,
          color: C.text,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <AlertTriangle color={C.bad} size={28} />
        <div>{loadError}</div>
      </div>
    );
  }

  const sheets = db.sheets;

  const currentSheet =
    sheets.find((s) => s.id === sheetId) ||
    sheets[0];

  const hideSheetTabsOnMobile =
    view === "capacity" || view === "settings";

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 24,
      }}
    >
      <GlobalStyle />


      {/* DESKTOP SIDEBAR + KONTEN */}
      <div
        className={`desktop-app-layout ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <DesktopSidebar
          view={view}
          setView={setView}
          sheets={sheets}
          sheetId={sheetId}
          setSheetId={setSheetId}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          saveState={saveState}
        />

        <div className="desktop-app-content">
          {/* NAVIGASI MOBILE */}
           <MobileNavigation
            view={view}
            setView={setView}
            saveState={saveState}
            sheets={sheets}
            sheetId={sheetId}
            setSheetId={setSheetId}
          />
          {/* DAFTAR LINE UNTUK MOBILE */}
          <div
            className={`sheet-tabs-shell${
              hideSheetTabsOnMobile
                ? " sheet-tabs-shell--hide-mobile"
                : ""
            }`}
          >
            <SheetTabs
              sheets={sheets}
              sheetId={sheetId}
              setSheetId={setSheetId}
            />
          </div>

          {/* HALAMAN INPUT */}
          {view === "input" && (
            <InputView
              sheet={currentSheet}
              date={date}
              setDate={setDate}
              monthData={monthData}
              updateEntry={updateEntry}
              updateNgEntry={updateNgEntry}
              updateNote={updateNote}
              clearEntry={clearEntry}
            />
          )}

          {/* HALAMAN DASHBOARD */}
          {view === "dashboard" && (
            <DashboardView
              sheets={sheets}
              sheetId={sheetId}
              setSheetId={setSheetId}
              mk={mk}
              setDate={setDate}
              monthData={monthData}
              allMonths={db.months}
              exportDbCsv={exportDbCsv}
            />
          )}

          {/* KALKULATOR KAPASITAS */}
          {view === "capacity" && (
            <main className="capacity-page">
              <CapacityPanel
                sheets={sheets}
                allMonths={db.months}
              />
            </main>
          )}

          {/* HALAMAN PENGATURAN */}
          {view === "settings" && (
            <SettingsView
              sheets={sheets}
              addSheet={addSheet}
              removeSheet={removeSheet}
              updateSheetName={updateSheetName}
              addMetric={addMetric}
              updateMetric={updateMetric}
              removeMetric={removeMetric}
              moveSheet={moveSheet}
              theme={theme}
              setTheme={setTheme}
              addNgType={addNgType}
              updateNgType={updateNgType}
              removeNgType={removeNgType}
            />
          )}
        </div>
      </div>

           <style>{`
        @media (max-width: 768px) {
          .sheet-tabs-shell {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
