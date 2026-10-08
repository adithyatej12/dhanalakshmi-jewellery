import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");

    try {

      // Login and get JWT
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // Store JWT
      localStorage.setItem("token", response.data);

      // Store email for frontend display
      localStorage.setItem("userEmail", email);

      // Get logged-in user's profile
      const profileResponse = await API.get("/customer/profile");

      const user = profileResponse.data;

      // Store role
      localStorage.setItem("userRole", user.role);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }

    } catch (error) {

      console.error(error);

      // Remove invalid token if login/profile request fails
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      setError(
        error.response?.data ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="text-center mb-4">

          <div className="auth-logo">
            💎
          </div>

          <h2>
            Welcome Back
          </h2>

          <p className="text-muted">
            Login to Dhanalakshmi Jewellery
          </p>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-3">

            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-2">

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />

          </div>

          {/* Forgot Password */}
          <div className="text-end mb-4">

            <Link
              to="/forgot-password"
              className="auth-link"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn jewellery-button w-100"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-4">

          <p className="mb-1">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="auth-link"
          >
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;