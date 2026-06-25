import { useState, useMemo } from "react";
import {
  searchLocation,
  getCategoryPlaces,
  CATEGORIES,
} from "../services/api";

const EMOJI = {
  restaurant: "🍔",
  cafe: "☕",
  hospital: "🏥",
  hotel: "🏨",
  pharmacy: "💊",
  bank: "🏦",
  atm: "🏧",
  school: "🏫",
  college: "🎓",
  fuel: "⛽",
  supermarket: "🛒",
  park: "🌳",
};

export default function Sidebar({
  location,
  setLocation,
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
  selectedPlace,
  setSelectedPlace,
  loading,
  setLoading,
}) {
  const [query, setQuery] = useState("");

  const places = useMemo(() => {
    if (!selectedCategory) return [];
    return categories[selectedCategory] || [];
  }, [categories, selectedCategory]);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const result = await searchLocation(query);

      if (!result) {
        alert("Location not found");
        return;
      }

      setLocation(result);
      setCategories({});
      setSelectedCategory(null);
      setSelectedPlace(null);
    } catch (err) {
      console.error(err);
      alert("Unable to search.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCategoryClick(category) {
    if (!location) {
      alert("Search a location first.");
      return;
    }

    if (loading) return;

    setSelectedCategory(category.id);
    setSelectedPlace(null);

    if (categories[category.id]) return;

    try {
      setLoading(true);

      const result = await getCategoryPlaces(
        location.lat,
        location.lng,
        category
      );

      setCategories((prev) => ({
        ...prev,
        [category.id]: result,
      }));
    } catch (err) {
      console.error(err);
      if (err.name === "AbortError") {
        alert("Request timed out. Please try again.");
      } else {
        alert("Unable to fetch places.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col text-white">

          {/* HEADER */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-3xl font-bold">
          🌍 Explore
        </h1>

        <p className="mt-1 text-sm text-white/60">
          Location Intelligence Dashboard
        </p>

        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search area..."
            className="
              flex-1
              rounded-2xl
              border
              border-white/10
              bg-white/10
              px-4
              py-3
              outline-none
              backdrop-blur-xl
              placeholder:text-white/40
            "
          />

          <button
            onClick={handleSearch}
            className="
              rounded-2xl
              bg-blue-500
              px-6
              py-3
              font-semibold
              transition
              hover:bg-blue-600
            "
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/70">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-blue-400" />
          <p className="text-sm">Fetching nearby places…</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">

          {location && (
            <div className="p-5">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-xl">
                <p className="font-semibold">
                  📍 Selected Area
                </p>

                <p className="mt-2 text-sm text-white/60">
                  {location.name}
                </p>
              </div>
            </div>
          )}

          <div className="px-5">
            <h2 className="mb-4 text-lg font-semibold">
              Nearby Categories
            </h2>

            <div className="space-y-3">
              {CATEGORIES.map((category) => {
                const loaded = category.id in categories;
                const count = categories[category.id]?.length ?? 0;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      w-full
                      rounded-2xl
                      px-4
                      py-3
                      transition
                      ${
                        selectedCategory === category.id
                          ? "bg-blue-500"
                          : "bg-white/10 hover:bg-white/20"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {EMOJI[category.id]} {category.label}
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {loaded ? count : "—"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>          <div className="p-5">
            <h2 className="mb-4 text-lg font-semibold">
              Places
            </h2>

            {selectedCategory && places.length === 0 ? (
              <div className="rounded-2xl bg-white/10 p-5 text-center text-white/60">
                No places found for this category.
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className={`
                      w-full
                      rounded-2xl
                      bg-white/10
                      p-4
                      text-left
                      transition
                      hover:bg-white/20
                      ${
                        selectedPlace?.id === place.id
                          ? "ring-2 ring-blue-400"
                          : ""
                      }
                    `}
                  >
                    <h3 className="font-semibold">
                      {EMOJI[place.category]} {place.name}
                    </h3>

                    <p className="mt-2 text-xs text-white/60">
                      {place.address}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}