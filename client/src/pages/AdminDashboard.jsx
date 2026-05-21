import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/");
  }, [user, navigate]);

  // Fetch functions
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const res = await api.get("/items/pending");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/auth/all");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchItems();
    fetchUsers();
  }, []);

  // Admin actions
  const toggleBan = async (userId) => {
    try {
      await api.put(`/auth/${userId}/ban`);
      setUsers(users.map(u => u._id === userId ? { ...u, banned: !u.banned } : u));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle ban");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/auth/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const updateItemStatus = async (itemId, status) => {
  try {
    await api.put(`/items/${itemId}/status`, { status });
    setItems(items.filter(i => i._id !== itemId));
    setStats(prev => ({
      ...prev,
      pendingItems: prev.pendingItems > 0 ? prev.pendingItems - 1 : 0
    }));
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};


  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">Total Users</h2>
              <p className="text-2xl">{stats.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">Total Items</h2>
              <p className="text-2xl">{stats.totalItems || 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">Pending Approvals</h2>
              <p className="text-2xl">{stats.pendingItems || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Pending Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Items Pending Approval</h2>
        {loadingItems ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items pending approval</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                <p className="text-xs text-gray-400 mb-2">By: {item.user?.name || "Unknown"}</p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => updateItemStatus(item._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => updateItemStatus(item._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <div key={u._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{u.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{u.email}</p>
                <p className="text-xs text-gray-400 mb-2">Role: {u.role}</p>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      u.banned ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500 hover:bg-gray-600"
                    }`}
                    onClick={() => toggleBan(u._id)}
                  >
                    {u.banned ? "Unban" : "Ban"}
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
