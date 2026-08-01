export default function Navbar() {
  return (
    <header className="bg-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Shelby NFT Metadata Manager
          </h1>

          <p className="text-blue-100 text-sm mt-1">
            Build, preview and export NFT metadata.
          </p>
        </div>

        <nav className="flex gap-4">

          <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
            Dashboard
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500 transition">
            Collections
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500 transition">
            Settings
          </button>

        </nav>

      </div>
    </header>
  );
}