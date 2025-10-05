import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function VisualizationPanel({ data }) {
  if (!data) return null;

  const { type, labels, datasets } = data;

  // ✅ Normalize dataset labels into safe keys
  const safeDatasets = (datasets || []).map((ds) => {
    const safeKey = ds.label.replace(/[^a-zA-Z0-9_]/g, "_");
    return { ...ds, safeKey };
  });

  // ✅ Build chartData with safeKeys
  const chartData = (labels || []).map((label, idx) => {
    const entry = { name: label };
    safeDatasets.forEach((ds) => {
      entry[ds.safeKey] = ds.values[idx] ?? 0;
    });
    return entry;
  });

  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">📊 Visualization</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          {type === "bar" && (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {safeDatasets.map((ds, i) => (
                <Bar
                  key={ds.safeKey}
                  dataKey={ds.safeKey}
                  name={ds.label} // 👈 original label dikhana
                  fill={colors[i % colors.length]}
                />
              ))}
            </BarChart>
          )}

          {type === "line" && (
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {safeDatasets.map((ds, i) => (
                <Line
                  key={ds.safeKey}
                  type="monotone"
                  dataKey={ds.safeKey}
                  name={ds.label}
                  stroke={colors[i % colors.length]}
                />
              ))}
            </LineChart>
          )}

          {type === "pie" && (
            <PieChart>
              <Pie
                data={chartData.map((row) => ({
                  name: row.name,
                  value: safeDatasets[0]?.values[labels.indexOf(row.name)] || 0,
                }))}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {labels.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
