import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await axios.post("/user/register", {
        name,
        email,
        password,
        role,
      });
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#fffae3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000080]">Create Account</h2>
          <p className="text-sm text-gray-500">
            Sign up to get started with Better Health
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-1">
            <label htmlFor="name" className="font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Deepika Sharma"
              onFocus={() => setMessage("")}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setMessage("")}
              placeholder="Deepika@xyz.com"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="●●●●●●●●●"
              onFocus={() => setMessage("")}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            >
              <option value="user">User</option>
              <option value="doctor">Psychologist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ec5228] hover:bg-[#d64720] text-white font-semibold py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
        {message && (
          <div className="text-green-600 text-center text-sm">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Signup;
