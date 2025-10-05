import { useEffect, useState } from "react";

export function usePlanets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanets() {
      try {
        const res = await fetch("http://localhost:4000/api/v1/planets");
        const data = await res.json();

        console.log("🌍 API Response:", data);

        // ✅ Fix: planets array actually `data.items` ke andar hai
        if (data && Array.isArray(data.items)) {
          setPlanets(data.items);
        } else {
          setPlanets([]);
        }
      } catch (err) {
        console.error("Error fetching planets:", err);
        setPlanets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlanets();
  }, []);

  return { planets, loading };
}
