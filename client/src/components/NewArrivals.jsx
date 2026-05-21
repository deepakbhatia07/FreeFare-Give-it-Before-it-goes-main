import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function NewArrivals({ searchQuery }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items/new-arrivals");
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleRequest = (item) => {
    if (!user) {
      alert("Please login to request this item!");
      return;
    }
    // TODO: handle request logic here
  };

  // Filter items dynamically based on searchQuery
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading items...</p>;
  if (!filteredItems.length)
    return <p className="text-center mt-10">No items found for "{searchQuery}"</p>;

  return (
    <section id="new-arrivals" className="py-16 px-6 md:px-20 bg-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Featured Items</h2>
        <p className="text-gray-300 mt-2">
          Discover amazing items shared by your community members
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-2 left-2 px-2 py-1 text-sm font-semibold rounded ${
                  item.price === "0" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                }`}
              >
                {item.price === "0" ? "Free" : `$${item.price}`}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-gray-300 mt-1 text-sm line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center text-gray-400 text-sm">
                <div>
                  <p className="text-sm text-gray-400">
  {item.location?.city}, {item.location?.region}
</p>

                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                  <p>by {item.user?.name || "Unknown"}</p>
                </div>
                <button
                  onClick={() => handleRequest(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  {item.price === "0" ? "Request Item" : "View Details"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="text-center mt-8">
        <a
          href="/items"
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          View All Items
        </a>
      </div>
    </section>
  );
}
