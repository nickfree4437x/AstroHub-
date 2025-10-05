// src/pages/AstronautAnalytics.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  ResponsiveContainer as BarResponsive,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as PieTooltip,
  ResponsiveContainer as PieResponsive,
  LineChart,
  Line,
  ResponsiveContainer as LineResponsive,
} from "recharts";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { fetchAstronauts } from "../../lib/astronautApi";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function AstronautAnalytics() {
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAstronauts = async () => {
    setLoading(true);
    try {
      let all = [];
      let page = 1;
      let fetched = [];
      do {
        fetched = (await fetchAstronauts({ page }))?.astronauts || [];
        all = [...all, ...fetched];
        page++;
      } while (fetched.length > 0);
      setAstronauts(all);
    } catch (err) {
      console.error("Error fetching astronauts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAstronauts();
  }, []);

  const { barData, pieData, lineData, mapData } = useMemo(() => {
    const data = Array.isArray(astronauts) ? astronauts : [];

    // Bar: Astronauts per Country
    const countryMap = {};
    data.forEach((a) => {
      if (a.agency?.country) countryMap[a.agency.country] = (countryMap[a.agency.country] || 0) + 1;
    });
    const barData = Object.entries(countryMap).map(([country, count]) => ({ country, count }));

    // Pie: Status
    const statuses = ["Active", "Retired", "Deceased"];
    const pieData = statuses.map((status) => ({
      name: status,
      value: data.filter((a) => a.status === status).length,
    }));

    // Line: Missions per Year
    const yearMap = {};
    data.forEach((a) => {
      const year = a.firstFlightYear || "Unknown";
      yearMap[year] = (yearMap[year] || 0) + (a.missions || 0);
    });
    const lineData = Object.entries(yearMap)
      .map(([year, missions]) => ({ year, missions }))
      .sort((a, b) =>
        a.year === "Unknown" ? 1 : b.year === "Unknown" ? -1 : a.year - b.year
      );

    // Map: astronauts with coordinates
    const mapData = data
      .filter((a) => a.lat !== undefined && a.lon !== undefined)
      .map((a) => ({ lat: a.lat, lon: a.lon }));

    return { barData, pieData, lineData, mapData };
  }, [astronauts]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading astronaut data...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Astronaut Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pie Chart: Status */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Astronaut Status</h2>
          {pieData.reduce((acc, item) => acc + item.value, 0) === 0 ? (
            <p className="text-gray-300 text-center py-20">Status data not available</p>
          ) : (
            <PieResponsive width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
                <Legend />
              </PieChart>
            </PieResponsive>
          )}
        </div>
      </div>
    </div>
  );
}
