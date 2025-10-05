// src/components/PlanetDetailModal.jsx
import React, { useState } from "react";
import { 
  Radar, 
  Bar, 
  Doughnut,
  Line 
} from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Filler, 
  Tooltip, 
  Legend,
  Title 
} from "chart.js";

ChartJS.register(
  RadialLinearScale, 
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Filler, 
  Tooltip, 
  Legend,
  Title
);

export default function PlanetDetailModal({ planet, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!planet) return null;

  // Use the existing habitability data from planet object
  const habitabilityScore = planet.habitability?.score || 0;
  const habitabilityLabel = planet.habitability?.label || "Unknown";
  const habitabilityBreakdown = planet.habitability?.breakdown || {};

  // Data for radar chart (comparison with Earth)
  const radarLabels = ["Size", "Mass", "Orbit", "Temperature", "Atmosphere", "Water"];
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: planet.name,
        data: [
          habitabilityBreakdown.radius?.score100 || habitabilityBreakdown.radius?.contribution || 0,
          habitabilityBreakdown.mass?.score100 || habitabilityBreakdown.mass?.contribution || 0,
          habitabilityBreakdown.orbit?.score100 || habitabilityBreakdown.orbit?.contribution || 0,
          habitabilityBreakdown.temp?.score100 || habitabilityBreakdown.temp?.contribution || 0,
          habitabilityBreakdown.atmosphere?.score100 || habitabilityBreakdown.atmosphere?.contribution || 0,
          habitabilityBreakdown.water?.score100 || habitabilityBreakdown.water?.contribution || 0,
        ],
        fill: true,
        backgroundColor: "rgba(34, 211, 238, 0.2)",
        borderColor: "rgba(34, 211, 238, 1)",
        pointBackgroundColor: "rgba(34, 211, 238, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 211, 238, 1)",
      },
      {
        label: "Earth",
        data: [100, 100, 100, 100, 100, 100],
        fill: true,
        backgroundColor: "rgba(132, 204, 22, 0.1)",
        borderColor: "rgba(132, 204, 22, 0.8)",
        pointBackgroundColor: "rgba(132, 204, 22, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(132, 204, 22, 1)",
      },
    ],
  };

  // Data for habitability breakdown bar chart
  const barData = {
    labels: Object.keys(habitabilityBreakdown).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        label: 'Habitability Score',
        data: Object.values(habitabilityBreakdown).map(item => 
          item.score100 || item.contribution || 0
        ),
        backgroundColor: 'rgba(34, 211, 238, 0.7)',
        borderColor: 'rgba(34, 211, 238, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for habitability score doughnut chart
  const doughnutData = {
    labels: ['Habitability Score', 'Remaining'],
    datasets: [
      {
        data: [habitabilityScore, 100 - habitabilityScore],
        backgroundColor: [
          'rgba(34, 211, 238, 0.8)',
          'rgba(75, 85, 99, 0.2)',
        ],
        borderColor: [
          'rgba(34, 211, 238, 1)',
          'rgba(75, 85, 99, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for orbital characteristics line chart
  const generateOrbitalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Simulate orbital position variations based on actual planet data
    const planetOrbitalPeriod = planet.orbitalPeriod || 365;
    const planetVariation = (planetOrbitalPeriod / 365) * 15; // Scale variation based on orbital period
    
    const planetPositions = months.map((_, index) => {
      const base = 50;
      const variation = Math.sin((index / 12) * Math.PI * 2) * planetVariation;
      return Math.round(base + variation);
    });

    const earthPositions = months.map((_, index) => {
      const base = 50;
      const variation = Math.sin((index / 12) * Math.PI * 2) * 15;
      return Math.round(base + variation);
    });

    return {
      labels: months,
      datasets: [
        {
          label: `${planet.name} Orbital Variation`,
          data: planetPositions,
          borderColor: 'rgba(34, 211, 238, 1)',
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Earth Orbital Variation',
          data: earthPositions,
          borderColor: 'rgba(132, 204, 22, 1)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const orbitalData = generateOrbitalData();

  // Chart options
  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Planet Characteristics vs Earth',
        color: '#f3f4f6',
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#e5e7eb' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: '#e5e7eb',
        }
      }
    },
    elements: { line: { borderWidth: 2 } }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Habitability Factor Breakdown',
        color: '#f3f4f6',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#e5e7eb' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#e5e7eb' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Overall Habitability Score',
        color: '#f3f4f6',
      },
    },
    cutout: '70%',
  };

  const orbitalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Orbital Position Variation',
        color: '#f3f4f6',
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#e5e7eb' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#e5e7eb' }
      }
    }
  };

  // Helper function to determine habitability label color
  const getHabitabilityColor = (label) => {
    if (!label) return 'text-gray-400';
    
    switch(label.toLowerCase()) {
      case 'high': 
      case 'highly habitable':
        return 'text-green-400';
      case 'moderate': 
      case 'potentially habitable':
        return 'text-yellow-400';
      case 'low': 
      case 'marginally habitable':
        return 'text-orange-400';
      case 'uninhabitable': 
      case 'non-habitable':
        return 'text-red-400';
      default: 
        return 'text-gray-400';
    }
  };

  // Helper function to get actual values from breakdown
  const getBreakdownValue = (key) => {
    const item = habitabilityBreakdown[key];
    if (!item) return "N/A";
    
    if (item.value !== undefined) return item.value;
    if (item.score100 !== undefined) return `${item.score100}%`;
    if (item.contribution !== undefined) return `${item.contribution}%`;
    
    return "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl p-6 relative overflow-hidden shadow-2xl border border-gray-700">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 z-10"
          aria-label="Close"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">{planet.name}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-300">
              Overall Score: <span className="text-green-400 font-semibold">{habitabilityScore}/100</span>
            </p>
            <p className={getHabitabilityColor(habitabilityLabel)}>
              {habitabilityLabel}
            </p>
            <p className="text-gray-400 text-sm">
              Orbital Period: {planet.orbitalPeriod} days
            </p>
            <p className="text-gray-400 text-sm">
              Discovery: {planet.discoveryYear}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-2">
            {['overview', 'analytics', 'comparison', 'details'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium rounded-t-lg transition-colors duration-200 ${activeTab === tab ? 'bg-sky-900 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Charts */}
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-xl">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="bg-gray-800 p-4 rounded-xl">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-xl">
                  <h3 className="text-white font-semibold mb-4 text-lg">Planet Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Radius</span>
                        <span className="text-white">{planet.radius} R⊕</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Mass</span>
                        <span className="text-white">{planet.mass} M⊕</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Orbital Period</span>
                        <span className="text-white">{planet.orbitalPeriod} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Distance</span>
                        <span className="text-white">{planet.distance} ly</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Semi-Major Axis</span>
                        <span className="text-white">{planet.semiMajorAxis} AU</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Eccentricity</span>
                        <span className={planet.eccentricity === 0 ? "text-green-400" : "text-yellow-400"}>
                          {planet.eccentricity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Discovery Method</span>
                        <span className="text-white">{planet.discoveryMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Flare Activity</span>
                        <span className={planet.flareActivity === 0 ? "text-green-400" : "text-red-400"}>
                          {planet.flareActivity === 0 ? "Low" : "High"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl">
                  <h3 className="text-white font-semibold mb-4 text-lg">Habitability Factors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(habitabilityBreakdown).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-white text-sm font-medium capitalize mb-1">{key}</h4>
                        <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
                          <div 
                            className="bg-sky-400 h-1.5 rounded-full" 
                            style={{ width: `${value.score100 || value.contribution || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-sky-400 text-xs font-semibold">
                          {value.score100 || value.contribution || 0}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-xl">
                <Bar data={barData} options={barOptions} />
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <Line data={orbitalData} options={orbitalOptions} />
              </div>
              <div className="bg-gray-800 p-4 rounded-xl lg:col-span-2">
                <h3 className="text-white font-semibold mb-4 text-lg">Detailed Habitability Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(habitabilityBreakdown).map(([key, value]) => (
                    <div key={key} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-medium capitalize">{key}</h4>
                        <span className="text-sky-400 font-semibold">
                          {value.score100 || value.contribution || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-sky-400 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${value.score100 || value.contribution || 0}%` }}
                        ></div>
                      </div>
                      {value.value && (
                        <p className="text-xs text-gray-400">Value: {value.value}</p>
                      )}
                      {value.description && (
                        <p className="text-xs text-gray-400 mt-1">{value.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="bg-gray-800 p-4 rounded-xl">
              <h3 className="text-white font-semibold mb-4 text-lg">Comparison with Earth</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-300 mb-3">Key Metrics Comparison</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Habitability Score", earth: 100, planet: habitabilityScore, unit: "" },
                      { label: "Radius", earth: 1, planet: planet.radius, unit: "R⊕" },
                      { label: "Mass", earth: 1, planet: planet.mass, unit: "M⊕" },
                      { label: "Orbital Period", earth: 365, planet: planet.orbitalPeriod, unit: "days" },
                      { label: "Orbital Eccentricity", earth: 0.0167, planet: planet.eccentricity, unit: "" },
                    ].map((metric, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-300 font-medium">{metric.label}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-green-400 font-bold">{metric.earth}{metric.unit}</div>
                            <div className="text-gray-400 text-sm">Earth</div>
                          </div>
                          <div className="text-gray-500 mx-2">vs</div>
                          <div className="text-center">
                            <div className="text-sky-400 font-bold">{metric.planet}{metric.unit}</div>
                            <div className="text-gray-400 text-sm">{planet.name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-300 mb-3">Habitability Radar Comparison</h4>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <Radar 
                      data={radarData} 
                      options={{
                        ...radarOptions,
                        plugins: {
                          ...radarOptions.plugins,
                          title: { display: false }
                        }
                      }} 
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">
                      Earth Similarity: <span className="text-green-400">{Math.round(habitabilityScore)}%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-white font-semibold mb-4 text-lg">Physical Characteristics</h3>
                <div className="space-y-3">
                  {[
                    { label: "Discovery Method", value: planet.discoveryMethod },
                    { label: "Discovery Year", value: planet.discoveryYear },
                    { label: "Orbital Period", value: `${planet.orbitalPeriod} days` },
                    { label: "Semi-Major Axis", value: `${planet.semiMajorAxis} AU` },
                    { label: "Eccentricity", value: planet.eccentricity },
                    { label: "Distance from Earth", value: `${planet.distance} light years` },
                    { label: "Host Star", value: planet.hostStar || "Unknown" },
                    { label: "Star Type", value: planet.starType || "Unknown" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-white font-semibold mb-4 text-lg">Habitability Analysis</h3>
                <div className="space-y-3">
                  {[
                    { label: "Overall Score", value: `${habitabilityScore}/100` },
                    { label: "Habitability Level", value: habitabilityLabel },
                    { label: "Radius Category", value: planet.radius > 2 ? "Super-Earth" : planet.radius > 1.5 ? "Large Terrestrial" : "Earth-like" },
                    { label: "Mass Category", value: planet.mass > 10 ? "Gas Giant" : planet.mass > 5 ? "Neptune-like" : "Terrestrial" },
                    { label: "Orbital Stability", value: planet.eccentricity === 0 ? "Highly Stable" : "Moderate" },
                    { label: "Flare Risk", value: planet.flareActivity === 0 ? "Low" : "High" },
                    { label: "Size Ratio", value: `${planet.radius.toFixed(1)}× Earth` },
                    { label: "Mass Ratio", value: `${planet.mass.toFixed(1)}× Earth` },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}