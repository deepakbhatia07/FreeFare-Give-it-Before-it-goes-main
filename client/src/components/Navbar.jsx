import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <nav className="bg-gray-900 shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-green-500 text-2xl">🌱</span>
        <span className="font-bold text-xl text-white">FreeFare</span>
      </div>

      {/* Center Links */}
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-200 dark:text-gray-300 hover:text-green-500">Home</Link>
        <Link to="/items" className="text-gray-200 dark:text-gray-300 hover:text-green-500">Items</Link>
        {/* <Link to="/profile" className="text-gray-200 dark:text-gray-300 hover:text-green-500">Profile</Link> */}
        <Link
  to={user ? "/profile" : "#"}
  onClick={(e) => {
    if (!user) {
      e.preventDefault();     // stop navigation
      setShowLogin(true);     // open login modal
    }
  }}
  className="text-gray-200 hover:text-green-500"
>
  Profile
</Link>

        
        {/* ⭐ ADD CONDITIONAL ADMIN LINK HERE ⭐ */}
        {user && user.role === "admin" && (
          <Link 
            to="/admin" 
            className="text-yellow-400 font-semibold hover:text-yellow-300 border-l-2 pl-6 border-gray-700"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Wait until loading is done */}
        {!loading && (
          !user ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Signup
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-gray-200">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )
        )}
      </div>

      {/* Modals */}
      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
      {showSignup && <SignupModal closeModal={() => setShowSignup(false)} />}
    </nav>
  );
}