// import { useState, useEffect, useContext, useRef } from "react";
// import { Search, Filter, Plus, MapPin, Clock, Heart, X } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios"; 
// import ShareItemModal from "../components/ShareItemModal";

// export default function Items() {
//   const { user } = useContext(AuthContext);
//   const [items, setItems] = useState([]);
//   const [locationScope, setLocationScope] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [showShare, setShowShare] = useState(false);
//   const [filterType, setFilterType] = useState([]);
//   const [filterCategory, setFilterCategory] = useState([]);
//   const [filterCategoryInput, setFilterCategoryInput] = useState("");
//   const [filterLocation, setFilterLocation] = useState("");

//   const dropdownRef = useRef(null);

//   const toggleArrayValue = (arr, value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   // Fetch items with filters
//   // const fetchItems = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const params = {};
//   //     if (searchQuery) params.name = searchQuery;
//   //     if (filterType.length) params.type = filterType.join(",");
//   //     if (filterCategory.length) params.category = filterCategory.join(",");
//   //     if (filterLocation) params.location = filterLocation;

//   //     const res = await api.get("/items/filter", { params });
//   //     // Format images to full URL if needed
//   //     const formattedItems = res.data.map(item => ({
//   //       ...item,
//   //       images: item.images && item.images.length
//   //         ? item.images.map(img => (img.startsWith("http") ? img : `/uploads/${img}`))
//   //         : ["/placeholder.png"]
//   //     }));
//   //     setItems(formattedItems);
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Failed to load items");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const fetchItems = async () => {
//   try {
//     setLoading(true);

//     let res;

//     // 📍 Near-me filtering (uses /items)
//     if (locationScope !== "all") {
//       res = await api.get(`/items?scope=${locationScope}`);
//     } 
//     // 🔍 Advanced filters (uses /items/filter)
//     else {
//       const params = {};
//       if (searchQuery) params.name = searchQuery;
//       if (filterType.length) params.type = filterType.join(",");
//       if (filterCategory.length) params.category = filterCategory.join(",");
//       if (filterLocation) params.location = filterLocation;

//       res = await api.get("/items/filter", { params });
//     }

//     setItems(res.data);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to load items");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchItems();
//   }, [filterType, filterCategory, filterLocation, searchQuery,locationScope]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowFilterDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleShareItem = () => {
//     if (!user) return alert("Please login to share an item");
//     setShowShare(true);
//   };

//   const handleRequest = async (itemId) => {
//     try {
//       await api.post("/requests", { itemId }); 
//       alert("Request sent successfully!");
//       fetchItems(); 
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to send request");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold mb-2 text-white">Community Items</h1>
//             <p className="text-gray-200">
//               Discover free and low-cost items shared by your neighbors
//             </p>
//           </div>
//           <button
//             onClick={handleShareItem}
//             className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             <Plus className="h-4 w-4" />
//             Share Item
//           </button>
//           {showShare && <ShareItemModal closeModal={() => setShowShare(false)} />}
//         </div>

//         {/* Search & Filters */}
//         <div className="bg-gray-900 p-6 mb-8 rounded shadow flex flex-col sm:flex-row gap-4 relative">
//           <div className="relative flex-1 bg-white">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 p-2 border rounded"
//             />
//           </div>

//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//               className="flex items-center gap-2 border px-3 py-2 rounded bg-green-500 text-white hover:bg-gray-100 hover:text-gray-800"
//             >
//               <Filter className="h-4 w-4" />
//               Filters
//             </button>

//             {showFilterDropdown && (
//               <div className="absolute right-0 mt-2 w-64 bg-gray-100 text-gray-800 border rounded shadow p-4 z-50">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold text-gray-700">Filters</span>
//                   <X className="h-4 w-4 cursor-pointer" onClick={() => setShowFilterDropdown(false)} />
//                 </div>

//                 {/* Type */}
//                 <div className="mb-2">
//                   <label className="font-semibold text-gray-600 text-sm">Type</label>
//                   <div className="flex gap-2 mt-1">
//                     {["free", "paid"].map((type) => (
//                       <button
//                         key={type}
//                         onClick={() => setFilterType(toggleArrayValue(filterType, type))}
//                         className={`px-2 py-1 text-xs rounded border ${
//                           filterType.includes(type) ? "bg-green-500 text-white" : "bg-white text-gray-700"
//                         }`}
//                       >
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div className="mb-2">
//                   <label className="font-semibold text-gray-600 text-sm">Category</label>
//                   <div className="flex gap-2 mt-1 flex-wrap mb-2">
//                     {["Books", "Bikes", "Appliances", "Plants", "Furniture", "Exercise"].map((cat) => (
//                       <button
//                         key={cat}
//                         onClick={() => setFilterCategory(toggleArrayValue(filterCategory, cat))}
//                         className={`px-2 py-1 text-xs rounded border ${
//                           filterCategory.includes(cat) ? "bg-green-500 text-white" : "bg-white text-gray-700"
//                         }`}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Other categories..."
//                     value={filterCategoryInput}
//                     onChange={(e) => setFilterCategoryInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && e.target.value.trim()) {
//                         setFilterCategory(toggleArrayValue(filterCategory, e.target.value.trim()));
//                         setFilterCategoryInput("");
//                         e.preventDefault();
//                       }
//                     }}
//                     className="w-full border rounded px-2 py-1 text-sm"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div className="mb-2">
//                   <label className="font-semibold text-gray-600 text-sm">Location</label>
//                   <input
//                     type="text"
//                     placeholder="Location"
//                     value={filterLocation}
//                     onChange={(e) => setFilterLocation(e.target.value)}
//                     className="w-full border rounded px-2 py-1 text-sm mt-1"
//                   />
//                 </div>

//                 {/* Reset */}
//                 <button
//                   onClick={() => {
//                     setFilterType([]);
//                     setFilterCategory([]);
//                     setFilterLocation("");
//                   }}
//                   className="w-full bg-gray-200 text-gray-700 text-sm py-1 rounded mt-2 hover:bg-gray-300"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Items Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {loading ? (
//             <p className="text-white">Loading items...</p>
//           ) : items.length === 0 ? (
//             <p className="text-white">No items found.</p>
//           ) : (
//             items.map((item) => (
//               <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden group">
//                 <div className="relative">
//                   <img
//                     src={item.images[0]}
//                     alt={item.name}
//                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
//                     {item.type === "free" ? "Free" : `$${item.price}`}
//                   </div>
//                   <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">
//                     {item.status}
//                   </div>
//                   <button className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
//                     <Heart className="h-4 w-4" />
//                   </button>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-semibold mb-2 truncate">{item.name}</h3>
//                   <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>

//                   <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-3 w-3" />
//                       <p className="text-sm text-gray-400">
//   {item.location?.city}, {item.location?.region}
// </p>

//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {new Date(item.createdAt).toLocaleString()}
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">
//                       by {item.user?.name || "Unknown"}
//                     </span>
//                     <button
//                       className={`px-3 py-1 rounded text-white ${
//                         item.status !== "approved" || item.taken
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-green-500 hover:bg-green-600"
//                       }`}
//                       disabled={item.status !== "approved" || item.taken}
//                       onClick={() => item.status === "approved" && !item.taken && handleRequest(item._id)}
//                     >
//                       {item.taken
//                         ? "Taken"
//                         : item.status === "pending"
//                         ? "Pending"
//                         : item.status === "rejected"
//                         ? "Rejected"
//                         : "Request"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useContext, useRef } from "react";
import { Search, Filter, Plus, MapPin, Clock, Heart, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ShareItemModal from "../components/ShareItemModal";

export default function Items() {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterCategoryInput, setFilterCategoryInput] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // 📍 Location scope
  const [locationScope, setLocationScope] = useState("all"); // all | city | state

  // UI
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const dropdownRef = useRef(null);

  const toggleArrayValue = (arr, value) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  // ================= FETCH ITEMS =================
  const fetchItems = async () => {
    try {
      setLoading(true);

      let res;

      // 📍 Near-me filtering
      if (locationScope !== "all") {
        res = await api.get(`/items?scope=${locationScope}`);
      } 
      // 🔍 Advanced filters
      else {
        const params = {};
        if (searchQuery) params.name = searchQuery;
        if (filterType.length) params.type = filterType.join(",");
        if (filterCategory.length) params.category = filterCategory.join(",");
        if (filterLocation) params.location = filterLocation;

        res = await api.get("/items/filter", { params });
      }

      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [
    searchQuery,
    filterType,
    filterCategory,
    filterLocation,
    locationScope,
  ]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleShareItem = () => {
    if (!user) return alert("Please login to share an item");
    setShowShare(true);
  };

  const handleRequest = async (itemId) => {
    try {
      await api.post("/requests", { itemId });
      alert("Request sent!");
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Community Items</h1>
            <p className="text-gray-300">
              Discover items shared by people around you
            </p>
          </div>

          <button
            onClick={handleShareItem}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Share Item
          </button>

          {showShare && <ShareItemModal closeModal={() => setShowShare(false)} />}
        </div>

        {/* ===== SEARCH + LOCATION ===== */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">

          {/* Search */}
          <div className="relative flex-1 bg-white rounded">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 p-2 rounded"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Near Me */}
         <select
  value={locationScope}
  onChange={e => setLocationScope(e.target.value)}
  disabled={!user?.location?.city}
  className={`px-3 py-2 rounded ${
    user?.location?.city
      ? "bg-gray-800 text-white"
      : "bg-gray-600 text-gray-300 cursor-not-allowed"
  }`}
>
  <option value="all">All locations</option>
  <option value="city">Near me (city)</option>
  <option value="state">Near me (state)</option>
</select>

{!user?.location?.city && (
  <p className="text-xs text-gray-400 mt-1">
    Set your location in profile to enable nearby items
  </p>
)}


          {/* Filters */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white p-4 rounded shadow z-50">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Filters</span>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => setShowFilterDropdown(false)} />
                </div>

                {/* Type */}
                <label className="text-sm font-semibold">Type</label>
                <div className="flex gap-2 my-2">
                  {["free", "paid"].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(toggleArrayValue(filterType, t))}
                      className={`px-2 py-1 text-xs rounded border ${
                        filterType.includes(t)
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Location text */}
                <label className="text-sm font-semibold">Location (text)</label>
                <input
                  className="w-full border p-1 rounded text-sm"
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                />

                <button
                  onClick={() => {
                    setFilterType([]);
                    setFilterCategory([]);
                    setFilterLocation("");
                  }}
                  className="w-full mt-3 bg-gray-200 py-1 rounded text-sm"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== ITEMS GRID ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-white">No items found</p>
          ) : (
            items.map(item => (
              <div key={item._id} className="bg-white rounded shadow overflow-hidden">
                <img
                  src={item.images?.[0]}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

                  <div className="flex justify-between text-xs text-gray-500 my-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[item.location?.city, item.location?.region]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    disabled={item.status !== "approved" || item.taken}
                    onClick={() => handleRequest(item._id)}
                    className={`w-full mt-2 py-1 rounded text-white ${
                      item.status !== "approved" || item.taken
                        ? "bg-gray-400"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {item.taken ? "Taken" : "Request"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
