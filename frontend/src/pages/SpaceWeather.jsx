// src/pages/SpaceWeather.jsx
import HeroHeader from "../components/spaceWeather/HeroHeader";
import SolarPanel from "../components/spaceWeather/SolarPanel";
import RadiationPanel from "../components/spaceWeather/RadiationPanel";
import GeomagneticPanel from "../components/spaceWeather/GeomagneticPanel";
import InteractiveCharts from "../components/spaceWeather/InteractiveCharts";
import AlertsPanel from "../components/spaceWeather/AlertsPanel";
import HistoricalForecastPanel from "../components/spaceWeather/HistoricalForecastPanel";
import SafetyImpactPanel from "../components/spaceWeather/SafetyImpactPanel";
import EducationalSidebar from "../components/spaceWeather/EducationalSidebar";

export default function SpaceWeather() {
  return (
    <div className="space-weather-page">
      {/* Hero / Header */}
      <HeroHeader />

      {/* Main Panels */}
      <main className="px-4 md:px-12 space-y-12">
        <SolarPanel />
        <RadiationPanel />
        <GeomagneticPanel />
        <InteractiveCharts />
        <AlertsPanel />
        <HistoricalForecastPanel />
        <SafetyImpactPanel />

        {/* Educational Sidebar */}
        <EducationalSidebar />
      </main>
    </div>
  );
}
