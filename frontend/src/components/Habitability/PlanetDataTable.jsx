// src/components/PlanetDataTable.jsx
import React, { useState, useMemo } from "react";
import { 
  FaSearch, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaChevronLeft, 
  FaChevronRight,
  FaGlobe,
  FaRulerCombined,
  FaWeightHanging,
  FaChartLine,
  FaCalendarAlt,
  FaRocket,
  FaWater,
  FaWind
} from "react-icons/fa";

export default function PlanetDataTable({ planets = [], onPlanetClick }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("habitability.score");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Columns configuration - Only available data
  const columns = [
    { 
      label: "Planet Name", 
      key: "name", 
      icon: <FaGlobe className="text-blue-400" />,
      width: "w-1/5"
    },
    { 
      label: "Distance (ly)", 
      key: "distance", 
      icon: <FaChartLine className="text-cyan-400" />,
      width: "w-1/6"
    },
    { 
      label: "Discovery Year", 
      key: "discoveryYear", 
      icon: <FaCalendarAlt className="text-yellow-400" />,
      width: "w-1/6"
    },
    { 
      label: "Discovery Method", 
      key: "discoveryMethod", 
      icon: <FaRocket className="text-purple-400" />,
      width: "w-1/6"
    },
    { 
      label: "Mass (M⊕)", 
      key: "mass", 
      icon: <FaWeightHanging className="text-green-400" />,
      width: "w-1/6"
    },
    { 
      label: "Radius (R⊕)", 
      key: "radius", 
      icon: <FaRulerCombined className="text-orange-400" />,
      width: "w-1/6"
    },
    { 
      label: "Orbital Period", 
      key: "orbitalPeriod", 
      icon: <FaWind className="text-red-400" />,
      width: "w-1/6"
    },
    { 
      label: "Habitability", 
      key: "habitability.score", 
      icon: <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500"></div>,
      width: "w-1/6"
    },
  ];

  // Filter and sort planets
  const filteredAndSortedPlanets = useMemo(() => {
    const filtered = planets.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.discoveryMethod && p.discoveryMethod.toLowerCase().includes(search.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      const aVal = sortKey.includes(".") 
        ? sortKey.split(".").reduce((o, k) => o?.[k], a) 
        : a[sortKey];
      const bVal = sortKey.includes(".") 
        ? sortKey.split(".").reduce((o, k) => o?.[k], b) 
        : b[sortKey];
      
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      
      if (typeof aVal === 'string') {
        return sortAsc 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [planets, search, sortKey, sortAsc]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPlanets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPlanets = filteredAndSortedPlanets.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) return <FaSort className="text-gray-400" />;
    return sortAsc ? <FaSortUp className="text-blue-400" /> : <FaSortDown className="text-blue-400" />;
  };

  const formatValue = (value, key) => {
    if (value === undefined || value === null) return "—";
    
    if (key === 'habitability.score') {
      return `${value}%`;
    }
    
    if (typeof value === 'number') {
      if (key === 'distance') return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(1);
      if (key === 'mass' || key === 'radius') return value.toFixed(2);
      if (key === 'orbitalPeriod') {
        if (value < 1) return `${(value * 24).toFixed(1)}h`;
        if (value < 365) return `${value.toFixed(1)}d`;
        return `${(value / 365).toFixed(1)}y`;
      }
    }
    
    return value;
  };

  const getHabitabilityColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push('...');
      
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      
      if (endPage < totalPages - 1) pages.push('...');
      if (endPage < totalPages) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      {/* Header with Search */}
      <div className="p-6 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Planetary Database</h2>
            <p className="text-gray-400 text-sm">
              {filteredAndSortedPlanets.length} planet{filteredAndSortedPlanets.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search planets or discovery methods..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/30 backdrop-blur-sm">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-700/30 transition-colors ${col.width}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <span>{col.label}</span>
                    {getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedPlanets.length > 0 ? (
              paginatedPlanets.map((planet, index) => (
                <tr
                  key={planet._id || planet.name}
                  className={`border-b border-gray-700/30 hover:bg-gray-700/20 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-gray-800/10' : 'bg-gray-800/5'
                  }`}
                  onClick={() => onPlanetClick(planet)}
                >
                  {columns.map(col => {
                    const value = col.key.includes(".") 
                      ? col.key.split(".").reduce((o, k) => o?.[k], planet) 
                      : planet[col.key];
                    
                    return (
                      <td key={col.key} className="px-6 py-4">
                        <div className={`${col.key === 'habitability.score' ? getHabitabilityColor(value) : 'text-gray-200'} font-medium`}>
                          {formatValue(value, col.key)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-gray-400 flex flex-col items-center">
                    <FaSearch className="text-3xl mb-2 opacity-50" />
                    <p className="text-lg">No planets found</p>
                    <p className="text-sm mt-1">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredAndSortedPlanets.length > 0 && (
        <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                {[5, 10, 25, 50].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>
                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAndSortedPlanets.length)} of {filteredAndSortedPlanets.length} entries
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-colors"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={page === '...'}
                  className={`min-w-[2.5rem] px-3 py-2 rounded-lg border transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                  } ${page === '...' ? 'cursor-default' : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-colors"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}