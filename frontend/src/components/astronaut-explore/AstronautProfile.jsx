// src/components/astronauts/AstronautProfileModal.jsx
import React, { useRef, useEffect, useState } from "react";
import AstronautProfileHeader from "./astronaut-profile/AstronautProfileHeader";
import AstronautBasicInfo from "./astronaut-profile/AstronautBasicInfo";
import AstronautMissionList from "./astronaut-profile/AstronautMissionList";
import AstronautAchievements from "./astronaut-profile/AstronautAchievements";
import AstronautQuotes from "./astronaut-profile/AstronautQuotes";

export default function AstronautProfileModal({ astronaut, onClose }) {
  const modalRef = useRef();
  const [activeTab, setActiveTab] = useState("overview"); // tabs: overview, missions, achievements, quotes

  if (!astronaut) return null;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Tab headers
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "missions", label: "Missions" },
    { id: "achievements", label: "Achievements" },
    { id: "quotes", label: "Quotes" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose} // Close on backdrop click
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-gray-900 text-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing on inside click
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold z-50"
        >
          ×
        </button>

        <div className="p-6">
          {/* Header */}
          <AstronautProfileHeader astronaut={astronaut} />

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 -mb-px font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "overview" && <AstronautBasicInfo astronaut={astronaut} />}
            {activeTab === "missions" && <AstronautMissionList astronaut={astronaut} />}
            {activeTab === "achievements" && <AstronautAchievements astronaut={astronaut} />}
            {activeTab === "quotes" && <AstronautQuotes quotes={astronaut.quotes} />}
          </div>
        </div>
      </div>
    </div>
  );
}
