import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupModal({ closeModal }) {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate(); // initialize navigation

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userData = await signup(fullName, email, password); // signup returns user
      closeModal(); // close the modal first
      navigate("/"); // navigate to home after signup
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
         onClick={closeModal}
      />

      {/* Modal */}
      <div
        className="relative z-50 bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Signup</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 text-white">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Signup
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
