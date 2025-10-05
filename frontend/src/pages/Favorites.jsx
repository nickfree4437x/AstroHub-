import React, { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import PlanetCard from "../components/explorer/PlanetCard";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">⭐ My Favorite Planets</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites yet. Add some planets 🚀</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((planet, idx) => (
            <PlanetCard key={idx} planet={planet} />
          ))}
        </div>
      )}
    </div>
  );
}
