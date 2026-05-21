// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// // 1. Import useNavigate
// import { useNavigate } from "react-router-dom"; 

// export default function LoginModal({ closeModal }) {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate(); // 2. Initialize useNavigate

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
      
//       // The 'login' function now returns the user data, which includes the role
//       const userData = await login(email, password); 
      
//       closeModal(); // Close the modal first
      
//       // 3. Check the user's role and navigate
//       if (userData?.role === "admin") {
//         navigate("/admin"); // Redirect to Admin Dashboard
//       } else {
//         navigate("/"); // Default redirect for regular users
//       }

//     } catch (err) {
//       alert("Login failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="absolute inset-0 z-40 flex items-center justify-center" onClick={closeModal}>
//       <div
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={closeModal}
//       />

//       <div
//         className="relative z-50 bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-3 text-white">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="p-2 border rounded"
//             required
//           />
//           <button
//             disabled={submitting}
//             className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
//           >
//             {submitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <button
//           onClick={closeModal}
//           className="mt-3 text-red-500 hover:underline"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }













// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function LoginModal({ closeModal }) {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const sendGPSLocationOnce = () => {
//     if (!navigator.geolocation) return;

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;

//         await api.put("/auth/me", {
//           location: {
//             lat: latitude,
//             lng: longitude,
//           },
//         });
//       },
//       () => {
//         console.log("Location permission denied");
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);

//       const userData = await login(email, password);

//       closeModal();

//       // 📍 Ask for GPS ONCE, AFTER LOGIN
//       sendGPSLocationOnce();

//       if (userData?.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (err) {
//       alert("Login failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="absolute inset-0 z-40 flex items-center justify-center" onClick={closeModal}>
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
//       <div
//         className="relative z-50 bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>

//         <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="p-2 border rounded"
//             required
//           />
//           <button
//             disabled={submitting}
//             className="bg-green-500 text-white py-2 rounded"
//           >
//             {submitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }









import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ closeModal }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const userData = await login(email, password);

      closeModal();

      if (userData?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      alert("Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        className="relative z-50 bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded text-white"
            required
          />

          <button
            disabled={submitting}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

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
