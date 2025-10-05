// src/components/HeroHeader.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion } from "framer-motion";

export default function HeroHeader() {
  const [weatherStatus, setWeatherStatus] = useState("Calm");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch space weather status from backend
  useEffect(() => {
    const getStatus = async () => {
      try {
        const data = await fetchSpaceWeatherSummary();
        // ✅ Correct KP index from geomagnetic
        const kp = data.geomagnetic?.kpIndex || 0;

        if (kp >= 5) setWeatherStatus("Severe");
        else if (kp >= 3) setWeatherStatus("Moderate");
        else setWeatherStatus("Calm");
      } catch (err) {
        console.error("Failed to fetch space weather status:", err);
      }
    };
    getStatus();

    // Update status every 60s
    const interval = setInterval(getStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Badge color based on status
  const statusColor =
    weatherStatus === "Calm"
      ? "bg-green-500"
      : weatherStatus === "Moderate"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center text-center text-white overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 animate-pulse opacity-60"
        style={{ filter: "blur(80px)" }}
      />

      <h1 className="text-5xl md:text-6xl font-bold z-10">
        Space Weather Tracker
      </h1>
      <p className="mt-4 text-xl md:text-2xl z-10">
        Monitor solar activity, geomagnetic storms, and radiation risks in real-time.
      </p>

      <div className="mt-6 flex items-center gap-4 z-10">
        <span className={`px-4 py-2 rounded-full font-semibold ${statusColor}`}>
          {weatherStatus}
        </span>
        <span className="px-4 py-2 rounded-full bg-gray-700 font-mono">
          {currentTime.toLocaleString()}
        </span>
      </div>
    </section>
  );
}
