import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import illustration from "../assets/hero-image.jpeg";

export default function HeroSection({ searchQuery, setSearchQuery, setShowShare }) {
  const { user } = useContext(AuthContext);
  const [localQuery, setLocalQuery] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalItems: 0, totalRequests: 0 });

  useEffect(() => {
    axios.get("http://localhost:3000/api/stats")
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  const handleShareItem = () => {
    if (!user) return alert("Please login to share an item!");
    setShowShare(true);
  };

  const handleSearch = () => {
    setSearchQuery(localQuery);
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrowseItems = () => {
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-gray-900 relative">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl font-bold text-white">
          Share <span className="text-green-500">More</span>, Waste Less
        </h1>
        <p className="text-gray-50">
          Join your community in sharing free and low-cost items. Reduce waste, save money, and build connections.
        </p>

        <div className="flex space-x-6 text-white">
          <input
            type="text"
            placeholder="Search items..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="flex-1 p-3 border rounded-l"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-3 rounded-r hover:bg-green-600 mr-4"
          >
            Search
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleShareItem}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Share an Item
          </button>
          <button
            onClick={handleBrowseItems}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Browse Items
          </button>
        </div>
      </div>

      <div className="md:w-1/2 relative mt-10 md:mt-0">
        <img
          src={illustration}
          alt="Community sharing illustration"
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div className="absolute top-4 right-4 bg-white text-green-700 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          {stats.totalUsers.toLocaleString()}+ Community Members
        </div>
        <div className="absolute bottom-4 left-4 bg-white text-green-700 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          {stats.totalItems.toLocaleString()}+ Items Shared
        </div>
      </div>
    </section>
  );
}
