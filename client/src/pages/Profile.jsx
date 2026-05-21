import { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />;

  const [myItems, setMyItems] = useState([]);
  const [requestsMade, setRequestsMade] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [activeTab, setActiveTab] = useState("items");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editableItem, setEditableItem] = useState(null);

  const [profileForm, setProfileForm] = useState({
  name: user.name,
  email: user.email,
  avatar: user.avatar || "",
  location: {
    city: user.location?.city || "",
    region: user.location?.region || "",
    country: user.location?.country || "",
  },
});


  /* ================= ADMIN REDIRECT ================= */
  // useEffect(() => {
  //   if (user.role === "admin") navigate("/admin");
  // }, [user, navigate]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    Promise.all([
      api.get("/items/my"),
      api.get("/requests/my"),
      api.get("/requests/received"),
    ]).then(([i, m, r]) => {
      setMyItems(i.data);
      setRequestsMade(m.data);
      setRequestsReceived(r.data);
      setLoading(false);
    });
  }, []);

  const statusBadge = (status) => {
    const map = {
      approved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>
        {status}
      </span>
    );
  };

  /* ================= ITEM MODALS ================= */
  const openViewItem = (item) => {
    setEditableItem(item);
    setModalType("view");
    setModalOpen(true);
  };

  const openEditItem = (item) => {
    if (item.status !== "pending") return;
    setEditableItem({ ...item });
    setModalType("edit");
    setModalOpen(true);
  };

  const saveItemChanges = async () => {
    await api.put(`/items/${editableItem._id}`, {
      name: editableItem.name,
      description: editableItem.description,
    });
    setMyItems((prev) =>
      prev.map((i) => (i._id === editableItem._id ? editableItem : i))
    );
    setModalOpen(false);
  };

  /* ================= PROFILE SAVE ================= */
  const saveProfile = async () => {
  const res = await api.put("/auth/me", {
    name: profileForm.name,
    email: profileForm.email,
    avatar: profileForm.avatar,
    location: profileForm.location,
  });

  setUser(res.data);
  alert("Profile updated");
};


  if (loading)
    return <p className="text-center mt-20 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ===== PROFILE HEADER ===== */}
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center mb-8">
          <img
            src={user.avatar || "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"}
            className="h-28 w-28 rounded-full object-cover border-4 border-gray-700"
          />
          <h1 className="text-xl font-semibold mt-4">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
         <p className="text-sm text-gray-400">
  {user.location?.city}
  {user.location?.region ? `, ${user.location.region}` : ""}
</p>


        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-3 justify-center mb-6">
          {[
            ["items", "My Items"],
            ["requests-made", "Requests Made"],
            ["requests-received", "Requests Received"],
            ["profile", "Profile"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === key
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ===== MY ITEMS ===== */}
        {activeTab === "items" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {myItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 rounded-lg p-4 flex gap-4"
              >
                <img
                  src={item.images?.[0]}
                  className="h-20 w-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {statusBadge(item.status)}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openViewItem(item)}
                    className="text-blue-400 text-sm"
                  >
                    View
                  </button>
                  <button
                    disabled={item.status !== "pending"}
                    onClick={() => openEditItem(item)}
                    className="text-yellow-400 text-sm disabled:opacity-40"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
{/* ===== REQUESTS MADE ===== */}
{activeTab === "requests-made" && (
  <div className="space-y-4">
    {requestsMade.length === 0 && (
      <p className="text-gray-400 text-center">
        You haven’t requested any items yet.
      </p>
    )}

    {requestsMade.map((req) => (
      <div
        key={req._id}
        className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold">{req.item?.name}</h3>
          <p className="text-sm text-gray-400">
            Owner: {req.item?.user?.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusBadge(req.status)}

          {/* CHAT BUTTON */}
          <Link
            to={`/chat/${req._id}`}
            className="text-blue-400 text-sm hover:underline"
          >
            Chat
          </Link>
        </div>
      </div>
    ))}
  </div>
)}
{/* ===== REQUESTS RECEIVED ===== */}
{activeTab === "requests-received" && (
  <div className="space-y-4">
    {requestsReceived.length === 0 && (
      <p className="text-gray-400 text-center">
        No one has requested your items yet.
      </p>
    )}

    {requestsReceived.map((req) => (
      <div
        key={req._id}
        className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold">{req.item?.name}</h3>
          <p className="text-sm text-gray-400">
            Requested by: {req.requester?.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusBadge(req.status)}

          {/* CHAT */}
          <Link
            to={`/chat/${req._id}`}
            className="text-blue-400 text-sm hover:underline"
          >
            Chat
          </Link>

          {/* ACTIONS */}
          {req.status === "pending" && (
            <>
              <button
                onClick={() =>
                  api.put(`/requests/${req._id}`, { status: "approved" })
                }
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  api.put(`/requests/${req._id}`, { status: "rejected" })
                }
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
)}

        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
  <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
    <h2 className="text-lg font-semibold mb-1">Edit Profile</h2>
    <p className="text-xs text-gray-400 mb-4">
      Location is detected automatically. You can edit it if incorrect.
    </p>

    {/* Avatar */}
    <label className="text-sm">Avatar URL</label>
    <input
      className="w-full p-2 mb-3 rounded bg-gray-700"
      value={profileForm.avatar}
      onChange={(e) =>
        setProfileForm({ ...profileForm, avatar: e.target.value })
      }
    />

    {/* Name */}
    <label className="text-sm">Name</label>
    <input
      className="w-full p-2 mb-3 rounded bg-gray-700"
      value={profileForm.name}
      onChange={(e) =>
        setProfileForm({ ...profileForm, name: e.target.value })
      }
    />

    {/* Email */}
    <label className="text-sm">Email</label>
    <input
      className="w-full p-2 mb-4 rounded bg-gray-700"
      value={profileForm.email}
      onChange={(e) =>
        setProfileForm({ ...profileForm, email: e.target.value })
      }
    />

    {/* Location */}
    <div className="grid grid-cols-1 gap-3 mb-4">
      <div>
        <label className="text-sm">City</label>
        <input
          className="w-full p-2 rounded bg-gray-700"
          value={profileForm.location.city}
          onChange={(e) =>
            setProfileForm({
              ...profileForm,
              location: {
                ...profileForm.location,
                city: e.target.value,
              },
            })
          }
        />
      </div>

      <div>
        <label className="text-sm">State / Region</label>
        <input
          className="w-full p-2 rounded bg-gray-700"
          value={profileForm.location.region}
          onChange={(e) =>
            setProfileForm({
              ...profileForm,
              location: {
                ...profileForm.location,
                region: e.target.value,
              },
            })
          }
        />
      </div>

      <div>
        <label className="text-sm">Country</label>
        <input
          className="w-full p-2 rounded bg-gray-700"
          value={profileForm.location.country}
          onChange={(e) =>
            setProfileForm({
              ...profileForm,
              location: {
                ...profileForm.location,
                country: e.target.value,
              },
            })
          }
        />
      </div>
    </div>

    <button
      onClick={saveProfile}
      className="bg-blue-600 px-4 py-2 rounded w-full"
    >
      Save Changes
    </button>
  </div>
)}


        {/* ===== ITEM MODAL ===== */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Item">
          {modalType === "view" && editableItem && (
            <>
              <img
                src={editableItem.images?.[0]}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-lg">{editableItem.name}</h3>
              <p className="text-gray-600 mt-2">
                {editableItem.description}
              </p>
            </>
          )}

          {modalType === "edit" && editableItem && (
            <>
              <label>Name</label>
              <input
                className="border p-2 w-full mb-2"
                value={editableItem.name}
                onChange={(e) =>
                  setEditableItem({ ...editableItem, name: e.target.value })
                }
              />
              <label>Description</label>
              <textarea
                className="border p-2 w-full mb-3"
                value={editableItem.description}
                onChange={(e) =>
                  setEditableItem({
                    ...editableItem,
                    description: e.target.value,
                  })
                }
              />
              <button
                onClick={saveItemChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}