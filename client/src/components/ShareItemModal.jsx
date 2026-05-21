import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";


export default function ShareItemModal({ closeModal }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "free",
    price: "",
    location: "",
    description: "",
    images: [], // store File objects
  });
  const [message, setMessage] = useState("");

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim() || !formData.category.trim()) {
    setMessage("❌ Name and category are required!");
    return;
  }

  try {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          data.append("images", value[i]);
        }
      } else {
        data.append(key, value);
      }
    });

    // Add logged-in user ID
    data.append("user", user._id);

    await api.post("/items", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMessage("🎉 Item shared successfully! Pending approval.");
    setFormData({
      name: "",
      category: "",
      type: "free",
      price: "",
      location: "",
      description: "",
      images: [],
    });
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("❌ Failed to share item.");
  }
};



  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center pt-40" onClick={closeModal}>
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div
        className="relative z-50 bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Share an Item</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 text-white">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          {formData.type === "paid" && (
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          )}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Share Item
          </button>
        </form>
        {message && <p className="mt-3 text-center text-sm text-white">{message}</p>}
        <button
          onClick={closeModal}
          className="mt-3 text-red-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
