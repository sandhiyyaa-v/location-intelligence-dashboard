const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

export const CATEGORIES = [
  {
    id: "restaurant",
    label: "🍔 Restaurants",
    key: "amenity",
    value: "restaurant",
  },
  {
    id: "cafe",
    label: "☕ Cafes",
    key: "amenity",
    value: "cafe",
  },
  {
    id: "hospital",
    label: "🏥 Hospitals",
    key: "amenity",
    value: "hospital",
  },
  {
    id: "hotel",
    label: "🏨 Hotels",
    key: "tourism",
    value: "hotel",
  },
  {
    id: "pharmacy",
    label: "💊 Pharmacies",
    key: "amenity",
    value: "pharmacy",
  },
  {
    id: "bank",
    label: "🏦 Banks",
    key: "amenity",
    value: "bank",
  },
  {
    id: "atm",
    label: "🏧 ATMs",
    key: "amenity",
    value: "atm",
  },
  {
    id: "school",
    label: "🏫 Schools",
    key: "amenity",
    value: "school",
  },
  {
    id: "college",
    label: "🎓 Colleges",
    key: "amenity",
    value: "college",
  },
  {
    id: "fuel",
    label: "⛽ Fuel Stations",
    key: "amenity",
    value: "fuel",
  },
  {
    id: "supermarket",
    label: "🛒 Supermarkets",
    key: "shop",
    value: "supermarket",
  },
  {
    id: "park",
    label: "🌳 Parks",
    key: "leisure",
    value: "park",
  },
];

export async function searchLocation(query) {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`
    );

    const data = await response.json();

    if (!data.length) return null;

    return {
      name: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Location search failed:", error);
    return null;
  }
}

export async function getCategoryPlaces(
  lat,
  lng,
  category
) {
  const query = `
[out:json][timeout:10];
(
  node["${category.key}"="${category.value}"](around:1000,${lat},${lng});
  way["${category.key}"="${category.value}"](around:1000,${lat},${lng});
  relation["${category.key}"="${category.value}"](around:1000,${lat},${lng});
);
out center;
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: query,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      `${category.label}:`,
      data.elements.length,
      "results"
    );

    return data.elements
      .map((place) => ({
        id: `${category.id}-${place.id}`,
        name: place.tags?.name || "Unnamed",
        category: category.id,
        address:
          place.tags?.["addr:full"] ||
          place.tags?.["addr:street"] ||
          place.tags?.["addr:suburb"] ||
          "Address unavailable",
        lat: place.lat ?? place.center?.lat,
        lng: place.lon ?? place.center?.lon,
      }))
      .filter(
        (place) =>
          place.lat !== undefined &&
          place.lng !== undefined
      );
  } catch (error) {
    console.error(
      "Overpass API Error:",
      error
    );

    return [];
  }
}