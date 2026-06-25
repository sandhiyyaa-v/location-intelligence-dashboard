import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MapView from "./MapView";

export default function Layout() {
  const [location, setLocation] = useState(null);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen bg-slate-950 overflow-hidden">
      <Navbar />

      <main className="relative h-[calc(100vh-72px)]">

        {/* MAP */}
        <div className="absolute inset-0 z-0">
          <MapView
            location={location}
            categories={categories}
            selectedCategory={selectedCategory}
            selectedPlace={selectedPlace}
          />
        </div>

        {/* GLASS SIDEBAR */}
        <div
          className="
            absolute
            top-6
            left-6
            bottom-6
            w-[370px]
            z-50

            rounded-3xl
            border border-white/20

            bg-white/10
            backdrop-blur-2xl

            shadow-2xl
            overflow-hidden
          "
        >
          <Sidebar
            location={location}
            setLocation={setLocation}
            categories={categories}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

      </main>
    </div>
  );
}