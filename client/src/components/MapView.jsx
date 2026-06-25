import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeView({ location }) {
  const map = useMap();

  if (location) {
    map.setView([location.lat, location.lng], 15);
  }

  return null;
}

function FlyToPlace({ place }) {
  const map = useMap();

  if (place) {
    map.flyTo([place.lat, place.lng], 17, {
      duration: 1.2,
    });
  }

  return null;
}

export default function MapView({
  location,
  categories,
  selectedCategory,
  selectedPlace,
}) {
  const places = selectedCategory
    ? categories[selectedCategory] || []
    : [];

  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={12}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeView location={location} />
      <FlyToPlace place={selectedPlace} />

      {location && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>{location.name}</Popup>
        </Marker>
      )}

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {place.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}