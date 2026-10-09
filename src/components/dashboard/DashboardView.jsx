
import { useEffect, useRef } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

import {
  Printer,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

import { C } from "../../constants/appConstants";

import {
  pad2,
  daysInMonth,
  monthLabel,
  qtyStd,
  pctAct,
  statusColor,
} from "../../utils/appUtils";

import StatCard from "./StatCard";
import CapacityPanel from "./CapacityPanel";

const dashTh = {
  padding: "9px 14px",
  fontSize: 11,
  color: C.muted,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontWeight: 600,
};

const dashTd = {
  padding: "8px 14px",
};

export default function DashboardView({
  sheets,
  sheetId,
  setSheetId,
  mk,
  setDate,
  monthData,
  allMonths,
  exportDbCsv,
}) {
  const sheet = sheets.find((s) => s.id === sheetId) || sheets[0];
  const dim = daysInMonth(mk);
  const sheetData = monthData[sheet.id] || {};
  const lastDataRowRef = useRef(null);

  const dailyRows = [];

  for (let d = 1; d <= dim; d++) {
    const iso = `${mk}-${pad2(d)}`;
    const dayEntry = sheetData[iso];

    if (!dayEntry) {
      dailyRows.push({
        day: d,
        iso,
        pcs: 0,
        menit: 0,
        pct: null,
        hasData: false,
      });
      continue;
    }

    let pcsSum = 0;
    let menitSum = 0;
    const pctList = [];

    sheet.metrics.forEach((metric) => {
      const value = dayEntry[metric.id];
      if (!value) return;

      pcsSum += Number(value.pcs) || 0;
      menitSum += Number(value.menit) || 0;

      const percentage = pctAct(
        value.pcs,
        qtyStd(value.menit, metric.ct)
      );

      if (percentage !== null) {
        pctList.push(percentage);
      }
    });

    const avg = pctList.length
      ? pctList.reduce((a, b) => a + b, 0) / pctList.length
      : null;

    dailyRows.push({
      day: d,
      iso,
      pcs: pcsSum,
      menit: menitSum,
      pct: avg,
      hasData: true,
    });
  }

  const withData = dailyRows.filter((row) => row.hasData);

  const totalPcs = withData.reduce(
    (sum, row) => sum + row.pcs,
    0
  );

  const totalMenitAll = withData.reduce(
    (sum, row) => sum + row.menit,
    0
  );

  const avgPct = withData.length
    ? withData.reduce(
        (sum, row) => sum + (row.pct || 0),
        0
      ) / withData.length
    : null;

  const best = withData.length
    ? withData.reduce((a, b) =>
        (b.pct ?? -1) > (a.pct ?? -1) ? b : a
      )
    : null;

  const lastDataRow =
    [...dailyRows].reverse().find((row) => row.hasData) || null;

  const chartData = dailyRows.map((row) => ({
    name: String(row.day),
    pct: row.pct === null ? null : Math.round(row.pct),
  }));

  useEffect(() => {
    // Pertahankan perilaku scroll otomatis pada HP.
    if (window.innerWidth > 768) return;

    const id = window.setTimeout(() => {
      lastDataRowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 180);

    return () => window.clearTimeout(id);
  }, [sheetId, mk, lastDataRow?.iso]);

  const monthOptions = [];

  const current = new Date(`${mk}-01T00:00:00`);

  for (let i = -4; i <= 2; i++) {
    const date = new Date(
      current.getFullYear(),
      current.getMonth() + i,
      1
    );

    const key = `${date.getFullYear()}-${pad2(
      date.getMonth() + 1
    )}`;

    monthOptions.push({
      key,
      label: date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    });
  }

  const controlStyle = {
    background: C.panel,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div
      className="print-area"
      style={{
        padding: 20,
        maxWidth: 1600,
        margin: "0 auto",
        minWidth: 0,
      }}
    >
      {/* FILTER DAN TOMBOL */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <select
          value={sheetId}
          onChange={(event) => setSheetId(event.target.value)}
          style={controlStyle}
        >
          {sheets.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={mk}
          onChange={(event) =>
            setDate(`${event.target.value}-01`)
          }
          style={{ ...controlStyle, color: C.amber, fontWeight: 600 }}
        >
          {monthOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <button
            onClick={exportDbCsv}
            style={{
              flex: "1 1 150px",
              maxWidth: 180,
              background: "#16A34A",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <FileSpreadsheet size={18} />
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            style={{
              flex: "1 1 150px",
              maxWidth: 180,
              background: C.amber,
              color: "#1A1D20",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <Printer size={18} />
            Cetak
          </button>
        </div>
      </div>

      {/* DESKTOP: TABEL KIRI, KALKULATOR KANAN */}
      <div className="dashboard-main-layout">
        <section style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              marginBottom: 4,
            }}
          >
            {sheet.name}
          </div>

          <div
            style={{
              color: C.muted,
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            {monthLabel(mk)} · Rekapitulasi Data Harian
          </div>

          {/* TABEL REKAPITULASI */}
          <div
            className="print-card"
            style={{
              background: C.panel,
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              overflowX: "auto",
              marginBottom: 24,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: C.panel2, textAlign: "left" }}>
                  <th style={dashTh}>Tgl</th>
                  <th style={dashTh}>%ACT</th>
                  <th style={dashTh}>Total Menit</th>
                  <th style={dashTh}>Total PCS</th>
                </tr>
              </thead>

              <tbody>
                {dailyRows.map((row) => (
                  <tr
                    key={row.iso}
                    ref={
                      lastDataRow?.iso === row.iso
                        ? lastDataRowRef
                        : null
                    }
                    onClick={() => setDate(row.iso)}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      cursor: "pointer",
                      background:
                        lastDataRow?.iso === row.iso
                          ? "var(--color-accent-soft)"
                          : "transparent",
                    }}
                    className="no-print-hover"
                  >
                    <td style={dashTd}>{row.day}</td>

                    <td
                      className="num-field"
                      style={{
                        ...dashTd,
                        color: statusColor(row.pct),
                        fontWeight: 600,
                      }}
                    >
                      {row.pct === null
                        ? "–"
                        : `${row.pct.toFixed(0)}%`}
                    </td>

                    <td
                      className="num-field"
                      style={{
                        ...dashTd,
                        color: row.hasData ? C.steel : C.muted,
                        fontWeight: 600,
                      }}
                    >
                      {row.hasData ? `${row.menit} m` : "–"}
                    </td>

                    <td
                      className="num-field"
                      style={{ ...dashTd, color: C.muted }}
                    >
                      {row.hasData
                        ? row.pcs.toLocaleString("id-ID")
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RINGKASAN BULAN */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <StatCard
              label="Total PCS"
              value={totalPcs.toLocaleString("id-ID")}
            />

            <StatCard
              label="Total Menit"
              value={`${totalMenitAll.toLocaleString("id-ID")} m`}
              color={C.steel}
            />

            <StatCard
              label="Rata-rata %ACT"
              value={
                avgPct === null
                  ? "—"
                  : `${avgPct.toFixed(1)}%`
              }
              color={statusColor(avgPct)}
            />

            <StatCard
              label="Hari terbaik"
              value={
                best
                  ? `Tgl ${best.day} · ${best.pct.toFixed(0)}%`
                  : "—"
              }
              icon={TrendingUp}
              color={C.good}
            />
          </div>

          {/* GRAFIK TREN BULANAN */}
          <div
            className="print-card"
            style={{
              background: C.panel,
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              padding: "16px 10px",
              height: 250,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                margin: "0 8px 12px",
              }}
            >
              Tren Pencapaian Harian (%ACT)
            </div>

            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.line}
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: C.muted, fontSize: 10 }}
                  axisLine={{ stroke: C.line }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: C.muted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 120]}
                />

                <Tooltip
                  contentStyle={{
                    background: C.panel2,
                    border: `1px solid ${C.line}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => `Tanggal ${label}`}
                  formatter={(value) => [
                    value === null ? "Belum ada data" : `${value}%`,
                    "%ACT",
                  ]}
                />

                <ReferenceLine
                  y={100}
                  stroke={C.muted}
                  strokeDasharray="4 4"
                />

                <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                  {chartData.map((item, index) => (
                    <Cell
                      key={index}
                      fill={statusColor(item.pct)}
                      opacity={item.pct === null ? 0.15 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* KALKULATOR HANYA DITAMPILKAN DI DESKTOP */}
        <CapacityPanel
          sheets={sheets}
          allMonths={allMonths}
        />
      </div>
    </div>
  );
}
