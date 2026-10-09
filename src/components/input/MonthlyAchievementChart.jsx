
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

import { C } from "../../constants/appConstants";

import {
  pad2,
  daysInMonth,
  monthKeyOf,
  monthLabel,
  qtyStd,
  pctAct,
  statusColor,
} from "../../utils/appUtils";

export default function MonthlyAchievementChart({
  sheet,
  date,
  monthData,
}) {
  const mk = monthKeyOf(date);
  const dim = daysInMonth(mk);
  const sheetData = monthData?.[sheet.id] || {};

  const data = [];

  for (let day = 1; day <= dim; day++) {
    const iso = `${mk}-${pad2(day)}`;
    const entry = sheetData[iso];

    let hasData = false;
    const percentages = [];

    if (entry) {
      sheet.metrics.forEach((metric) => {
        const value = entry[metric.id];

        if (!value) return;

        if (
          value.pcs !== undefined ||
          value.menit !== undefined
        ) {
          hasData = true;
        }

        const standard = qtyStd(value.menit, metric.ct);
        const percentage = pctAct(value.pcs, standard);

        if (percentage !== null) {
          percentages.push(percentage);
        }
      });
    }

    const achievement = percentages.length
      ? percentages.reduce((a, b) => a + b, 0) /
        percentages.length
      : null;

    data.push({
      day,
      pct: achievement === null
        ? null
        : Number(achievement.toFixed(1)),
      hasData,
    });
  }

  const daysWithAchievement = data.filter(
    (item) => item.pct !== null
  ).length;

  return (
    <section
      className="print-card"
      style={{
        marginTop: 18,
        marginBottom: 18,
        padding: 14,
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          marginBottom: 4,
        }}
      >
        Grafik Pencapaian Bulanan
      </div>

      <div
        style={{
          fontSize: 11,
          color: C.muted,
          marginBottom: 12,
        }}
      >
        {sheet.name} · {monthLabel(mk)}
      </div>

      <div style={{ height: 220, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={C.line}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: C.muted, fontSize: 10 }}
              axisLine={{ stroke: C.line }}
              tickLine={false}
              interval={2}
            />

            <YAxis
              domain={[0, 120]}
              tick={{ fill: C.muted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              contentStyle={{
                background: C.panel2,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(day) => `Tanggal ${day}`}
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
              {data.map((item) => (
                <Cell
                  key={item.day}
                  fill={statusColor(item.pct)}
                  opacity={item.pct === null ? 0.15 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          fontSize: 10.5,
          color: C.muted,
          marginTop: 8,
        }}
      >
        {daysWithAchievement} hari memiliki data pencapaian.
        Warna batang mengikuti status %ACT.
      </div>
    </section>
  );
}
