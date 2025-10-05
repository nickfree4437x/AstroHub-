// src/components/atmosphere/LayerInfo.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  FaThermometerHalf, 
  FaTachometerAlt, 
  FaLayerGroup, 
  FaWind,
  FaArrowUp,
  FaChartBar
} from "react-icons/fa";

export default function LayerInfo({ layers = [], tempFormatter = (temp) => temp }) {
  if (!layers || layers.length === 0) {
    return (
      <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
        <FaLayerGroup className="text-gray-500 text-3xl mx-auto mb-3" />
        <p className="text-gray-400">No atmospheric layer data available</p>
      </div>
    );
  }

  // Sort layers by altitude (highest first for natural reading)
  const sortedLayers = [...layers].sort((a, b) => {
    const altA = a.rangeKm ? a.rangeKm[1] : 0;
    const altB = b.rangeKm ? b.rangeKm[1] : 0;
    return altB - altA;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FaLayerGroup className="text-cyan-400" />
          Atmospheric Layers
        </h3>
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <FaArrowUp className="text-xs" />
          Altitude (km)
        </div>
      </div>

      {/* Layers List */}
      <div className="space-y-3">
        {sortedLayers.map((layer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              {/* Left: Layer Identity */}
              <div className="flex items-start gap-3 flex-1">
                {/* Color Indicator */}
                <div 
                  className="w-4 h-4 rounded-full mt-1 ring-2 ring-white/20 group-hover:ring-cyan-400/30 transition-all"
                  style={{ backgroundColor: layer.color || '#6b7280' }}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {layer.name || `Layer ${index + 1}`}
                    </h4>
                    {layer.rangeKm && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">
                        {layer.rangeKm[0]}–{layer.rangeKm[1]} km
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  {layer.description && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {layer.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Key Metrics */}
              <div className="text-right ml-4 min-w-[120px]">
                {/* Temperature */}
                {(layer.temp || layer.temperature) && (
                  <div className="flex items-center justify-end gap-1 mb-2">
                    <FaThermometerHalf className="text-red-400 text-xs" />
                    <span className="text-white font-medium text-sm">
                      {tempFormatter(layer.temp || layer.temperature) || '—'}
                    </span>
                  </div>
                )}
                
                {/* Pressure */}
                {layer.pressure && (
                  <div className="flex items-center justify-end gap-1">
                    <FaTachometerAlt className="text-blue-400 text-xs" />
                    <span className="text-white font-medium text-sm">
                      {layer.pressure}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Composition Bar Chart */}
            {layer.composition && Object.keys(layer.composition).length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <FaChartBar className="text-green-400 text-sm" />
                  <span className="text-white font-medium text-sm">Gas Composition</span>
                </div>
                
                {/* Composition Bars */}
                <div className="space-y-2">
                  {Object.entries(layer.composition)
                    .filter(([_, value]) => value > 0) // Only show gases with presence
                    .sort(([_, a], [__, b]) => b - a) // Sort by percentage descending
                    .map(([gas, percentage], gasIndex) => (
                    <div key={gas} className="flex items-center gap-3">
                      <span className="text-gray-300 text-xs font-medium min-w-[80px]">
                        {gas}
                      </span>
                      <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + gasIndex * 0.1 }}
                          className="h-3 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-cyan-400 font-bold text-xs min-w-[35px]">
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Properties */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {/* Density */}
                {layer.density && (
                  <div className="flex items-center gap-1">
                    <FaWind className="text-purple-400" />
                    <span className="text-gray-300">Density:</span>
                    <span className="text-white font-medium">{layer.density}</span>
                  </div>
                )}
                
                {/* Chemical Properties */}
                {layer.chemicalProperties && (
                  <div className="col-span-2">
                    <span className="text-gray-300">Properties: </span>
                    <span className="text-white">{layer.chemicalProperties}</span>
                  </div>
                )}
                
                {/* Phenomena */}
                {layer.phenomena && (
                  <div className="col-span-3">
                    <span className="text-gray-300">Phenomena: </span>
                    <span className="text-yellow-300">{layer.phenomena}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scientific Significance */}
            {layer.significance && (
              <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <FaChartBar className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-300 text-xs leading-relaxed">
                    {layer.significance}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
        <div className="flex items-center justify-between text-sm">
          <div className="text-cyan-300 font-medium">
            {sortedLayers.length} Atmospheric Layer{sortedLayers.length !== 1 ? 's' : ''} Analyzed
          </div>
          <div className="text-gray-400">
            Data sourced from planetary atmospheric studies
          </div>
        </div>
      </div>
    </div>
  );
}