
import { useEffect, useMemo, useState } from "react";
import { Clock3, Package, Boxes, CalendarDays } from "lucide-react";
import {
  pad2,
  monthLabel,
  todayISO, 
} from "../../utils/appUtils";
import { C } from "../../constants/appConstants";

const STORAGE_KEY = "papan-capacity-settings-v1";


function getInitialSettings(sheets) {
  const defaults = {
    lineIds: sheets.slice(0, 2).map((s) => s.id),
    period: "day",
    date: todayISO(),
  };

  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null"
    );

    if (!saved || typeof saved !== "object") {
      return defaults;
    }

    const validIds = (saved.lineIds || []).filter((id) =>
      sheets.some((s) => s.id === id)
    );

    return {
      lineIds: validIds.length
        ? validIds.slice(0, 2)
        : defaults.lineIds,
      period: ["day", "week", "month"].includes(saved.period)
        ? saved.period
        : defaults.period,
      date: /^\d{4}-\d{2}-\d{2}$/.test(saved.date || "")
        ? saved.date
        : defaults.date,
    };
  } catch {
    return defaults;
  }
}



function getPeriodDates(date, period) {
  const selected = new Date(`${date}T00:00:00`);

  if (Number.isNaN(selected.getTime())) {
    return [date];
  }

  let start = new Date(selected);
  let end = new Date(selected);

  if (period === "week") {
    const day = selected.getDay();
    const offset = day === 0 ? 6 : day - 1;

    start.setDate(selected.getDate() - offset);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (period === "month") {
    start = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1
    );
    end = new Date(
      selected.getFullYear(),
      selected.getMonth() + 1,
      0
    );
  }

  const dates = [];

  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    dates.push(
      `${cursor.getFullYear()}-${pad2(
        cursor.getMonth() + 1
      )}-${pad2(cursor.getDate())}`
    );
  }

  return dates;
}

function getLineTotals(sheet, allMonths, dates) {
  let pcs = 0;
  let menit = 0;

  if (!sheet) return { pcs, menit };

  dates.forEach((date) => {
    const monthKey = date.slice(0, 7);
    const entry =
      allMonths?.[monthKey]?.[sheet.id]?.[date];

    if (!entry) return;

    sheet.metrics.forEach((metric) => {
      const value = entry[metric.id];

      if (!value) return;

      pcs += Number(value.pcs) || 0;
      menit += Number(value.menit) || 0;
    });
  });

  return { pcs, menit };
}

function formatNumber(value) {
  return value.toLocaleString("id-ID");
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} menit`;
  if (remainder === 0) return `${hours} jam`;

  return `${hours} jam ${remainder} menit`;
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

const selectStyle = {
  width: "100%",
  minWidth: 0,
  padding: "10px 11px",
  borderRadius: 8,
  border: `1px solid ${C.line}`,
  background: C.panel2,
  color: C.text,
  fontSize: 12,
};

const labelStyle = {
  display: "block",
  color: C.muted,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.5,
  marginBottom: 6,
};

export default function CapacityPanel({
  sheets,
  allMonths,
}) {
  const [settings, setSettings] = useState(() =>
    getInitialSettings(sheets)
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.warn(
        "Tidak dapat menyimpan preferensi kapasitas:",
        error
      );
    }
  }, [settings]);

  // Jika sebuah sheet dihapus, pulihkan pilihan ke sheet valid.
  useEffect(() => {
    setSettings((prev) => {
      const validIds = prev.lineIds.filter((id) =>
        sheets.some((s) => s.id === id)
      );

      const nextIds = [...validIds];

      sheets.forEach((sheet) => {
        if (nextIds.length < 2 && !nextIds.includes(sheet.id)) {
          nextIds.push(sheet.id);
        }
      });

      if (
        nextIds.length === prev.lineIds.length &&
        nextIds.every((id, index) => id === prev.lineIds[index])
      ) {
        return prev;
      }

      return { ...prev, lineIds: nextIds };
    });
  }, [sheets]);

  const updateSetting = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setLine = (index, value) => {
    setSettings((prev) => {
      const ids = [...prev.lineIds];
      const otherIndex = index === 0 ? 1 : 0;

      // Hindari memilih line yang sama pada kedua dropdown.
      if (ids[otherIndex] === value) {
        ids[otherIndex] = ids[index];
      }

      ids[index] = value;

      return { ...prev, lineIds: ids };
    });
  };

  const dates = useMemo(
    () => getPeriodDates(settings.date, settings.period),
    [settings.date, settings.period]
  );

  const selectedSheets = settings.lineIds
    .map((id) => sheets.find((sheet) => sheet.id === id))
    .filter(Boolean);

  const lineTotals = selectedSheets.map((sheet) => ({
    sheet,
    ...getLineTotals(sheet, allMonths, dates),
  }));

  const totalPcs = lineTotals.reduce(
    (sum, line) => sum + line.pcs,
    0
  );

  const totalMenit = lineTotals.reduce(
    (sum, line) => sum + line.menit,
    0
  );

  const periodLabel =
    settings.period === "day"
      ? formatDate(settings.date)
      : settings.period === "week"
        ? `${formatDate(dates[0])} – ${formatDate(
            dates[dates.length - 1]
          )}`
        : monthLabel(settings.date.slice(0, 7));

  const inputStyle = {
    ...selectStyle,
    boxSizing: "border-box",
  };

  return (
    <aside
      className="capacity-panel"
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        overflow: "hidden",
        alignSelf: "start",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 16,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <Boxes size={30} color={C.amber} />

        <div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            Kalkulator Kapasitas
          </div>

          <div style={{ fontSize: 11, color: C.muted }}>
            Gabungan kapasitas beberapa line
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[0, 1].map((index) => {
            const selectedId = settings.lineIds[index] || "";

            return (
              <label key={index} style={{ minWidth: 0 }}>
                <span style={labelStyle}>
                  LINE {index === 0 ? "PERTAMA" : "KEDUA"}
                </span>

                <select
                  value={selectedId}
                  onChange={(event) =>
                    setLine(index, event.target.value)
                  }
                  style={inputStyle}
                >
                  {sheets.map((sheet) => (
                    <option
                      key={sheet.id}
                      value={sheet.id}
                      disabled={
                        settings.lineIds[
                          index === 0 ? 1 : 0
                        ] === sheet.id
                      }
                    >
                      {sheet.name}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>

        <div style={{ marginBottom: 18 }}>
          <span style={labelStyle}>PERIODE REKAPITULASI</span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 6,
            }}
          >
            {[
              { value: "day", label: "Hari" },
              { value: "week", label: "Minggu" },
              { value: "month", label: "Bulan" },
            ].map((item) => {
              const active = settings.period === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    updateSetting("period", item.value)
                  }
                  style={{
                    minWidth: 0,
                    padding: "10px 4px",
                    borderRadius: 8,
                    border: `1px solid ${
                      active ? C.amber : C.line
                    }`,
                    background: active
                      ? "var(--color-accent-soft)"
                      : C.panel2,
                    color: active ? C.amber : C.text,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <label style={{ display: "block", marginBottom: 18 }}>
          <span style={labelStyle}>TANGGAL ACUAN</span>

          <div style={{ position: "relative" }}>
            <CalendarDays
              size={16}
              color={C.muted}
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />

            <input
              type="date"
              value={settings.date}
              onChange={(event) =>
                updateSetting("date", event.target.value)
              }
              style={{
                ...inputStyle,
                paddingLeft: 36,
              }}
            />
          </div>
        </label>

        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            Hasil Gabungan
          </div>

          <div
            style={{
              fontSize: 11,
              color: C.muted,
              marginBottom: 14,
            }}
          >
            {selectedSheets.map((s) => s.name).join(" + ")}
            {" · "}
            {periodLabel}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                background: "var(--color-accent-soft)",
                border: `1px solid ${C.line}`,
                borderRadius: 10,
                padding: 12,
                minWidth: 0,
              }}
            >
              <Clock3 size={20} color={C.steel} />

              <div style={{ ...labelStyle, marginTop: 8 }}>
                TOTAL MENIT
              </div>

              <div
                className="num-field"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.steel,
                  overflowWrap: "anywhere",
                }}
              >
                {formatNumber(totalMenit)} m
              </div>

              <div style={{ fontSize: 10, color: C.muted }}>
                {formatDuration(totalMenit)}
              </div>
            </div>

            <div
              style={{
                background: "var(--color-accent-soft)",
                border: `1px solid ${C.line}`,
                borderRadius: 10,
                padding: 12,
                minWidth: 0,
              }}
            >
              <Package size={20} color={C.good} />

              <div style={{ ...labelStyle, marginTop: 8 }}>
                TOTAL PCS
              </div>

              <div
                className="num-field"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.good,
                  overflowWrap: "anywhere",
                }}
              >
                {formatNumber(totalPcs)}
              </div>

              <div style={{ fontSize: 10, color: C.muted }}>
                Total output aktual
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            Rincian per Line
          </div>

          <div
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr)",
                gap: 4,
                padding: "8px",
                background: C.panel2,
                fontSize: 10,
                color: C.muted,
              }}
            >
              <span>Line</span>
              <span>Menit</span>
              <span>PCS</span>
            </div>

            {lineTotals.map(({ sheet, menit, pcs }) => (
              <div
                key={sheet.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 4,
                  padding: 8,
                  borderTop: `1px solid ${C.line}`,
                  fontSize: 11,
                }}
              >
                <span style={{ overflowWrap: "anywhere" }}>
                  {sheet.name}
                </span>

                <span className="num-field" style={{ color: C.steel }}>
                  {formatNumber(menit)}
                </span>

                <span className="num-field">
                  {formatNumber(pcs)}
                </span>
              </div>
            ))}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr)",
                gap: 4,
                padding: 8,
                background: "var(--color-accent-soft)",
                borderTop: `1px solid ${C.line}`,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span>Total</span>
              <span className="num-field">
                {formatNumber(totalMenit)}
              </span>
              <span className="num-field">
                {formatNumber(totalPcs)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
