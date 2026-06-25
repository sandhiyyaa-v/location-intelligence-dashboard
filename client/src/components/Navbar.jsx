function Navbar() {
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div>
        <h1 className="text-3xl font-bold text-white">
          🌍 Location Intelligence Dashboard
        </h1>

        <p className="text-sm text-white/60 mt-1">
          Search • Explore • Navigate
        </p>
      </div>

      <div className="px-5 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 font-medium">
        🟢 OpenStreetMap
      </div>
    </header>
  );
}

export default Navbar;