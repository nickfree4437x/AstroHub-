// src/components/atmosphere/Atmosphere3DSlider.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaLayerGroup, 
  FaExpand, 
  FaCompress, 
  FaRulerVertical,
  FaInfoCircle
} from "react-icons/fa";
import Atmosphere3D from "./Atmosphere3D";

export default function Atmosphere3DSlider({ layers = [], planetName }) {
  const [scale, setScale] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Enhanced layer data with colors and descriptions
  const enhancedLayers = layers.map((layer, index) => ({
    ...layer,
    thicknessKm: layer.thicknessKm ? layer.thicknessKm * scale : 0,
    color: getLayerColor(index),
    description: getLayerDescription(layer.name || `Layer ${index + 1}`)
  }));

  function getLayerColor(index) {
    const colors = [
      "#3B82F6", // Blue - Troposphere
      "#10B981", // Green - Stratosphere
      "#F59E0B", // Amber - Mesosphere
      "#EF4444", // Red - Thermosphere
      "#8B5CF6", // Purple - Exosphere
      "#06B6D4", // Cyan
      "#F97316", // Orange
      "#84CC16", // Lime
    ];
    return colors[index % colors.length];
  }

  function getLayerDescription(layerName) {
    const descriptions = {
      "Troposphere": "Weather layer, contains most of atmosphere's mass",
      "Stratosphere": "Ozone layer, stable temperature gradient",
      "Mesosphere": "Meteor burning layer, temperature decreases",
      "Thermosphere": "Auroras occur, temperature increases with altitude",
      "Exosphere": "Outer layer, merges with space",
      "Ionosphere": "Electrically charged particles, affects radio waves"
    };
    return descriptions[layerName] || "Atmospheric layer with unique characteristics";
  }

  const handleScaleChange = (value) => {
    setScale(value);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const totalThickness = enhancedLayers.reduce((sum, layer) => sum + (layer.thicknessKm || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-2xl ${
        isExpanded ? 'fixed inset-4 z-50' : 'relative'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FaLayerGroup className="text-blue-400 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">3D Atmosphere Visualization</h3>
            <p className="text-gray-400 text-sm">{planetName}'s Atmospheric Layers</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleExpand}
          className="p-2 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-600/30 transition-colors"
        >
          {isExpanded ? (
            <FaCompress className="text-gray-400 hover:text-white" />
          ) : (
            <FaExpand className="text-gray-400 hover:text-white" />
          )}
        </motion.button>
      </div>

      {/* 3D Visualization Container */}
      <div className={`bg-black/30 rounded-xl border border-gray-600/30 mb-4 ${
        isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-80'
      }`}>
        <Atmosphere3D
          layers={enhancedLayers}
          planetName={planetName}
          onLayerHover={setActiveLayer}
          interactive={true}
        />
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        {/* Scale Slider */}
        <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaRulerVertical className="text-orange-400" />
              <label className="text-white font-medium">Altitude Scale</label>
            </div>
            <span className="text-orange-400 font-bold text-lg">{scale.toFixed(2)}×</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Compressed</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => handleScaleChange(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-gray-400 text-sm">Expanded</span>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1×</span>
            <span>1.5×</span>
            <span>3.0×</span>
          </div>
        </div>

        {/* Layer Information */}
        {activeLayer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FaInfoCircle className="text-blue-400" />
              <h4 className="text-white font-semibold">{activeLayer.name}</h4>
            </div>
            <p className="text-gray-300 text-sm mb-2">{activeLayer.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Thickness: </span>
                <span className="text-white">{activeLayer.thicknessKm?.toFixed(1)} km</span>
              </div>
              <div>
                <span className="text-gray-400">Temperature: </span>
                <span className="text-white">{activeLayer.temperature || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Layer Summary */}
        <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <FaLayerGroup className="text-green-400" />
            Atmospheric Summary
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{layers.length}</div>
              <div className="text-gray-400 text-xs">Total Layers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{totalThickness.toFixed(0)}</div>
              <div className="text-gray-400 text-xs">Total Thickness (km)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{scale.toFixed(1)}×</div>
              <div className="text-gray-400 text-xs">Current Scale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {layers[0]?.thicknessKm ? (layers[0].thicknessKm * scale).toFixed(0) : '0'}
              </div>
              <div className="text-gray-400 text-xs">Base Layer (km)</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleScaleChange(1)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-white text-sm transition-colors"
          >
            Reset Scale
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleScaleChange(2)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-white text-sm transition-colors"
          >
            Expand View
          </motion.button>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #3B82F6, #8B5CF6, #EF4444);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
}