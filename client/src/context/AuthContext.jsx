// import { createContext, useState, useEffect } from "react";
// import api from "../api/axios";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       api.get("/auth/me")
//         .then(res => setUser(res.data.user || res.data))
//         .catch(() => setUser(null))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, ...userData } = res.data;

//       localStorage.setItem("token", token);
//       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       setUser(userData);

//       return userData;
//     } catch (err) {
//       throw new Error("Login failed");
//     }
//   };

//   const signup = async (name, email, password) => {
//     const res = await api.post("/auth/register", { name, email, password });
//     const { token, ...userData } = res.data;

//     localStorage.setItem("token", token);
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     delete api.defaults.headers.common["Authorization"];
//   };

//   // ✅ Include setUser in context so Profile.jsx can use it
//   return (
//     <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };














import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER FROM TOKEN ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= GPS LOCATION (ONCE) ================= */
  const sendGPSLocationOnce = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          await api.put("/auth/me", {
            location: {
              lat: latitude,
              lng: longitude,
            },
          });

          // 🔄 Refresh user so UI updates immediately
          const me = await api.get("/auth/me");
          setUser(me.data);
        } catch (err) {
          console.error("Failed to update GPS location");
        }
      },
      () => {
        console.log("Location permission denied");
      },
      { enableHighAccuracy: true }
    );
  };

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, ...userData } = res.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);

    // 📍 GPS happens AFTER login, not inside backend auth
    sendGPSLocationOnce();

    return userData;
  };

  /* ================= SIGNUP ================= */
  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, ...userData } = res.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);

    // Optional: ask GPS after signup as well
    sendGPSLocationOnce();
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
