// src/components/astronauts/AstronautDirectory.jsx
import React, { useEffect, useState } from "react";
import { fetchAstronauts } from "../../lib/astronautApi";
import AstronautCard from "./AstronautCard";
import AstronautProfileModal from "./AstronautProfile";

export default function AstronautDirectory() {
  const [astronauts, setAstronauts] = useState([]);
  const [filteredAstronauts, setFilteredAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAstronaut, setSelectedAstronaut] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ name: "", agency: "", status: "" });
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const astronautsPerPage = 10;

  // Fetch all astronauts
  const loadAstronauts = async () => {
    setLoading(true);
    try {
      let allAstronauts = [];
      let page = 1;
      let fetched = [];
      do {
        fetched = (await fetchAstronauts({ page }))?.astronauts || [];
        allAstronauts = [...allAstronauts, ...fetched];
        page++;
      } while (fetched.length > 0);
      setAstronauts(allAstronauts);
    } catch (err) {
      console.error("Error fetching astronauts:", err);
    }
    setLoading(false);
  };

  // Favorites
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favoriteAstronauts")) || [];
    setFavorites(fav);
  }, []);
  useEffect(() => {
    localStorage.setItem("favoriteAstronauts", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    loadAstronauts();
  }, []);

  // Filter + Sort
  useEffect(() => {
    let filtered = astronauts.filter((a) => {
      const matchName = filters.name
        ? a.name?.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchAgency = filters.agency
        ? a.agency?.name?.toLowerCase().includes(filters.agency.toLowerCase())
        : true;
      const matchStatus = filters.status
        ? a.status?.toLowerCase() === filters.status.toLowerCase()
        : true;
      return matchName && matchAgency && matchStatus;
    });

    if (sortBy === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "firstFlightAsc")
      filtered.sort((a, b) => (a.firstFlightYear || 0) - (b.firstFlightYear || 0));
    else if (sortBy === "hoursDesc")
      filtered.sort((a, b) => (b.totalSpaceHours || 0) - (a.totalSpaceHours || 0));

    setFilteredAstronauts(filtered);
    setCurrentPage(1);
  }, [astronauts, filters, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ name: "", agency: "", status: "" });

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  // Pagination logic
  const indexOfLast = currentPage * astronautsPerPage;
  const indexOfFirst = indexOfLast - astronautsPerPage;
  const currentAstronauts = filteredAstronauts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAstronauts.length / astronautsPerPage);

  const getPagination = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-4">

      {/* Filters + Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 rounded-md flex-1 bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Agency"
          name="agency"
          value={filters.agency}
          onChange={handleFilterChange}
          className="p-2 rounded-md bg-gray-800 text-white"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Retired">Retired</option>
          <option value="Deceased">Deceased</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name A→Z</option>
          <option value="name-desc">Name Z→A</option>
          <option value="firstFlightAsc">First Flight ↑</option>
          <option value="hoursDesc">Total Hours ↓</option>
        </select>
        <button
          onClick={resetFilters}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Reset Filters
        </button>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.name && (
          <span
            onClick={() => setFilters((prev) => ({ ...prev, name: "" }))}
            className="bg-blue-500 px-2 py-1 rounded-full text-xs cursor-pointer"
          >
            Name: {filters.name} ×
          </span>
        )}
        {filters.agency && (
          <span
            onClick={() => setFilters((prev) => ({ ...prev, agency: "" }))}
            className="bg-blue-500 px-2 py-1 rounded-full text-xs cursor-pointer"
          >
            Agency: {filters.agency} ×
          </span>
        )}
        {filters.status && (
          <span
            onClick={() => setFilters((prev) => ({ ...prev, status: "" }))}
            className="bg-blue-500 px-2 py-1 rounded-full text-xs cursor-pointer"
          >
            Status: {filters.status} ×
          </span>
        )}
      </div>

      {/* Astronaut Cards */}
      {loading ? (
        <p className="text-white">Loading astronauts...</p>
      ) : currentAstronauts.length === 0 ? (
        <p className="text-gray-300">No astronauts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAstronauts.map((a) => (
            <AstronautCard
              key={a.externalId || a._id}
              astronaut={a}
              onClick={() => setSelectedAstronaut(a)}
              isFavorite={favorites.includes(a._id)}
              toggleFavorite={() => toggleFavorite(a._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 text-white flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {getPagination().map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 py-1">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded ${
                  currentPage === p ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedAstronaut && (
        <AstronautProfileModal
          astronaut={selectedAstronaut}
          onClose={() => setSelectedAstronaut(null)}
        />
      )}
    </div>
  );
}
