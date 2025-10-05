// src/hooks/usePlanetComparison.js
import { useEffect, useState } from "react";
import { comparePlanets } from "../lib/api";

export function usePlanetComparison(selectedPlanetName) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedPlanetName) return;

    async function fetchComparison() {
      setLoading(true);
      setError(null);

      try {
        // Backend expects 'planetB' key, Earth is fixed
        const data = await comparePlanets(["Earth", selectedPlanetName]);
        setComparison(data);
      } catch (err) {
        console.error("❌ Error fetching planet comparison:", err);
        setError(err.message || "Failed to fetch comparison");
        setComparison(null);
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, [selectedPlanetName]);

  return { comparison, loading, error };
}
