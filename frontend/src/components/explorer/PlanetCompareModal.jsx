// src/components/explorer/PlanetCompareModal.jsx
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf"; // ✅ FIXED: import jsPDF directly

// PDF Export without jspdf-autotable
const exportPDF = (planets) => {
  // Create a simple PDF without autoTable
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(66, 47, 145);
  doc.text("Planet Comparison Report", 14, 15);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Table data
  const headers = [
    "Name",
    "Host Star",
    "Discovery Method",
    "Year",
    "Distance (ly)",
    "Radius (R⊕)",
    "Mass (M⊕)",
    "Orbital Period (days)",
  ];

  let yPosition = 40;
  const rowHeight = 10;
  const colWidth = 24;

  // Draw table headers
  doc.setFillColor(66, 47, 145);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");

  headers.forEach((header, index) => {
    doc.rect(14 + index * colWidth, yPosition, colWidth, rowHeight, "F");
    doc.text(header, 16 + index * colWidth, yPosition + 6);
  });

  yPosition += rowHeight;

  // Draw table rows
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");

  planets.forEach((planet, rowIndex) => {
    const rowData = [
      planet.name ?? planet.pl_name ?? "Unknown",
      planet.hostStar ?? planet.hostname ?? "—",
      planet.discoveryMethod ?? planet.discoverymethod ?? "—",
      planet.discoveryYear ?? planet.disc_year ?? "—",
      planet.distance ?? planet.sy_dist ?? "—",
      planet.radius ?? planet.pl_rade ?? "—",
      planet.mass ?? planet.pl_bmasse ?? "—",
      planet.orbitalPeriod ?? planet.pl_orbper ?? "—",
    ];

    // Alternate row colors
    if (rowIndex % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(14, yPosition, colWidth * headers.length, rowHeight, "F");
    }

    rowData.forEach((cell, colIndex) => {
      doc.text(String(cell), 16 + colIndex * colWidth, yPosition + 6);
    });

    yPosition += rowHeight;

    // Add new page if needed
    if (yPosition > 270 && rowIndex < planets.length - 1) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Save the PDF
  doc.save("planets_comparison.pdf");
};

export default function PlanetCompareModal({ planets, onClose }) {
  const [activeTab, setActiveTab] = useState("table");

  // Compute best values for highlighting
  const bestValues = useMemo(() => {
    if (!planets || planets.length === 0) return {};
    return {
      minDistance: Math.min(
        ...planets.map((p) => p.distance ?? p.sy_dist ?? Infinity)
      ),
      maxRadius: Math.max(
        ...planets.map((p) => p.radius ?? p.pl_rade ?? -Infinity)
      ),
      maxMass: Math.max(
        ...planets.map((p) => p.mass ?? p.pl_bmasse ?? -Infinity)
      ),
    };
  }, [planets]);

  const highlight = (val, best, type = "max") => {
    if (val == null || isNaN(val)) return "";
    if (type === "min" && val === best) return "best-value";
    if (type === "max" && val === best) return "best-value";
    return "";
  };

  // Chart Data
  const chartData = planets.map((p, i) => ({
    name: p.name ?? p.pl_name ?? `Planet ${i + 1}`,
    distance: p.distance ?? p.sy_dist ?? 0,
    radius: p.radius ?? p.pl_rade ?? 0,
    mass: p.mass ?? p.pl_bmasse ?? 0,
  }));

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Host Star",
      "Discovery Method",
      "Year",
      "Distance from Earth (ly)",
      "Radius (R⊕)",
      "Mass (M⊕)",
      "Orbital Period (days)",
    ];
    const rows = planets.map((p) => [
      p.name ?? p.pl_name ?? "Unknown",
      p.hostStar ?? p.hostname ?? "—",
      p.discoveryMethod ?? p.discoverymethod ?? "—",
      p.discoveryYear ?? p.disc_year ?? "—",
      p.distance ?? p.sy_dist ?? "—",
      p.radius ?? p.pl_rade ?? "—",
      p.mass ?? p.pl_bmasse ?? "—",
      p.orbitalPeriod ?? p.pl_orbper ?? "—",
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "planets_compare.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export handler
  const handleExportPDF = () => {
    exportPDF(planets);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-indigo-500/30 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-indigo-300">
            {payload[0].name === "distance"
              ? "Distance: "
              : payload[0].name === "radius"
              ? "Radius: "
              : "Mass: "}
            <span className="text-white ml-1">
              {payload[0].value.toFixed(2)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 mt-32 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-gradient-to-br from-gray-900 via-space-dark to-gray-950 rounded-xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col border border-indigo-500/20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-indigo-500/30 sticky top-0 bg-space-dark/80 backdrop-blur-sm z-10">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Planet Comparison
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex bg-gray-800/70 rounded-lg p-1 mb-2 md:mb-0 md:mr-2">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  activeTab === "table"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  activeTab === "charts"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Charts
              </button>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-lg text-white text-sm flex items-center transition-transform hover:scale-105 mb-2 md:mb-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white text-sm flex items-center transition-transform hover:scale-105 mb-2 md:mb-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm flex items-center transition-transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "table" ? (
            /* Table View */
            <div className="overflow-x-auto rounded-xl border border-indigo-500/20 bg-space-dark/50 backdrop-blur-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-900/70 to-purple-900/70 text-gray-200 text-sm">
                    <th className="p-4 text-left font-semibold">Property</th>
                    {planets.map((p, i) => (
                      <th
                        key={i}
                        className="p-4 text-center font-semibold text-cyan-300"
                      >
                        {p.name ?? p.pl_name ?? `Planet ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Host Star
                    </td>
                    {planets.map((p, i) => (
                      <td key={i} className="p-4 text-center">
                        {p.hostStar ?? p.hostname ?? "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Discovery Method
                    </td>
                    {planets.map((p, i) => (
                      <td key={i} className="p-4 text-center">
                        {p.discoveryMethod ?? p.discoverymethod ?? "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Discovery Year
                    </td>
                    {planets.map((p, i) => (
                      <td key={i} className="p-4 text-center">
                        {p.discoveryYear ?? p.disc_year ?? "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Distance from Earth (ly)
                    </td>
                    {planets.map((p, i) => {
                      const dist = p.distance ?? p.sy_dist ?? null;
                      return (
                        <td
                          key={i}
                          className={`p-4 text-center ${highlight(
                            dist,
                            bestValues.minDistance,
                            "min"
                          )}`}
                        >
                          {dist != null ? dist.toFixed(2) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Radius (R⊕)
                    </td>
                    {planets.map((p, i) => {
                      const radius = p.radius ?? p.pl_rade ?? null;
                      return (
                        <td
                          key={i}
                          className={`p-4 text-center ${highlight(
                            radius,
                            bestValues.maxRadius,
                            "max"
                          )}`}
                        >
                          {radius != null ? radius.toFixed(2) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-indigo-500/20 hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Mass (M⊕)
                    </td>
                    {planets.map((p, i) => {
                      const mass = p.mass ?? p.pl_bmasse ?? null;
                      return (
                        <td
                          key={i}
                          className={`p-4 text-center ${highlight(
                            mass,
                            bestValues.maxMass,
                            "max"
                          )}`}
                        >
                          {mass != null ? mass.toFixed(2) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-indigo-900/20 transition-colors">
                    <td className="p-4 font-medium bg-indigo-900/10">
                      Orbital Period (days)
                    </td>
                    {planets.map((p, i) => (
                      <td key={i} className="p-4 text-center">
                        {p.orbitalPeriod ?? p.pl_orbper ?? "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* Charts View */
            <div className="space-y-8">
              {/* Distance Comparison */}
              <div className="bg-space-dark/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-indigo-500/20">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-300">
                    Distance Comparison (light years)
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" stroke="#a5b4fc" fontSize={12} />
                    <YAxis stroke="#a5b4fc" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="distance"
                      name="Distance (ly)"
                      radius={[4, 4, 0, 0]}
                      fill="#facc15"
                      stroke="#eab308"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.distance === bestValues.minDistance
                              ? "#4ade80"
                              : "#facc15"
                          }
                          stroke={
                            entry.distance === bestValues.minDistance
                              ? "#22c55e"
                              : "#eab308"
                          }
                          strokeWidth={
                            entry.distance === bestValues.minDistance ? 2 : 1
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radius Comparison */}
              <div className="bg-space-dark/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-indigo-500/20">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-500/20 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-pink-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-pink-300">
                    Radius Comparison (Earth radii)
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" stroke="#a5b4fc" fontSize={12} />
                    <YAxis stroke="#a5b4fc" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="radius"
                      name="Radius (R⊕)"
                      radius={[4, 4, 0, 0]}
                      fill="#8884d8"
                      stroke="#7c73e6"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.radius === bestValues.maxRadius
                              ? "#4ade80"
                              : "#8884d8"
                          }
                          stroke={
                            entry.radius === bestValues.maxRadius
                              ? "#22c55e"
                              : "#7c73e6"
                          }
                          strokeWidth={
                            entry.radius === bestValues.maxRadius ? 2 : 1
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mass Comparison */}
              <div className="bg-space-dark/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-indigo-500/20">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-500/20 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-300">
                    Mass Comparison (Earth masses)
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" stroke="#a5b4fc" fontSize={12} />
                    <YAxis stroke="#a5b4fc" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="mass"
                      name="Mass (M⊕)"
                      radius={[4, 4, 0, 0]}
                      fill="#82ca9d"
                      stroke="#6da788"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.mass === bestValues.maxMass
                              ? "#4ade80"
                              : "#82ca9d"
                          }
                          stroke={
                            entry.mass === bestValues.maxMass
                              ? "#22c55e"
                              : "#6da788"
                          }
                          strokeWidth={
                            entry.mass === bestValues.maxMass ? 2 : 1
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add custom styles for best values */}
      <style jsx>{`
        .best-value {
          color: #4ade80;
          font-weight: 600;
          position: relative;
        }
        .best-value::after {
          content: "✓";
          margin-left: 4px;
        }
        .bg-space-dark {
          background-color: #0f172a;
        }

        /* Remove hover effects from recharts bars */
        .recharts-bar-rectangle:hover {
          opacity: 1 !important;
        }

        /* Custom CSS to prevent hover effects */
        :global(.recharts-bar-rectangle) {
          transition: none !important;
        }

        :global(.recharts-bar-rectangle:hover) {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
