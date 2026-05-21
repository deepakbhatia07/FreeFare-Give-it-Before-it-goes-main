// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import ItemsPage from "./pages/ItemsPage";
// import ShareItem from "./components/ShareItemModal";
// import Profile from "./pages/Profile";


// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/items" element={<ItemsPage/>}/>
//           <Route path="/share" element={<ShareItem/>} />
//           <Route path="/profile" element={<Profile/>}/>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;






import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ItemsPage from "./pages/ItemsPage";
import ShareItem from "./components/ShareItemModal";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Chat from "./pages/Chat";
import { useContext } from "react";

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="text-white">Loading...</p>; // wait until auth loads

  return (
    <Routes>
      <Route
        path="/admin"
        element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/share" element={<ShareItem />} />
      <Route path="/chat/:requestId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
