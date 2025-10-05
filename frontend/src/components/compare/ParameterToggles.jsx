// src/components/compare/ParameterToggles.jsx
import React from "react";
import { FaCheck, FaSlidersH } from "react-icons/fa";

export default function ParameterToggles({ allMetrics, selectedMetrics, setSelectedMetrics }) {
  const toggleMetric = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const selectAll = () => {
    setSelectedMetrics([...allMetrics]);
  };

  const selectNone = () => {
    setSelectedMetrics([]);
  };

  const isAllSelected = selectedMetrics.length === allMetrics.length;
  const isNoneSelected = selectedMetrics.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FaSlidersH className="text-blue-400 text-sm" />
          </div>
          <div>
            <h3 className="font-medium text-white">Comparison Metrics</h3>
            <p className="text-gray-400 text-sm">
              {selectedMetrics.length} of {allMetrics.length} selected
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            disabled={isAllSelected}
            className="px-3 py-1 text-xs bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-30 rounded-md transition-colors text-blue-300"
          >
            All
          </button>
          <button
            onClick={selectNone}
            disabled={isNoneSelected}
            className="px-3 py-1 text-xs bg-gray-500/10 hover:bg-gray-500/20 disabled:opacity-30 rounded-md transition-colors text-gray-300"
          >
            None
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allMetrics.map(metric => {
          const isSelected = selectedMetrics.includes(metric);
          
          return (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`
                relative p-3 rounded-lg border transition-all duration-200 group
                ${isSelected 
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'bg-gray-500/5 border-gray-500/20 hover:bg-gray-500/10 hover:border-gray-500/30'
                }
              `}
            >
              {/* Checkbox */}
              <div className={`
                absolute top-2 right-2 w-4 h-4 rounded border flex items-center justify-center transition-all
                ${isSelected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'bg-white/5 border-gray-400 group-hover:border-gray-300'
                }
              `}>
                {isSelected && (
                  <FaCheck className="text-white text-xs" />
                )}
              </div>

              {/* Metric Name */}
              <span className={`
                text-sm font-medium transition-colors block text-left
                ${isSelected ? 'text-blue-300' : 'text-gray-300 group-hover:text-white'}
              `}>
                {metric}
              </span>

              {/* Status Dot */}
              <div className={`
                w-1.5 h-1.5 rounded-full mt-2 transition-colors
                ${isSelected ? 'bg-blue-400' : 'bg-gray-500 group-hover:bg-gray-400'}
              `} />
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-500/20 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(selectedMetrics.length / allMetrics.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 min-w-[60px] text-right">
          {Math.round((selectedMetrics.length / allMetrics.length) * 100)}%
        </span>
      </div>
    </div>
  );
}