import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage(response.data);

      // Send user to OTP verification
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: email,
          },
        });
      }, 800);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Registration failed. Please try again."
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
            Create Account
          </h2>

          <p className="text-muted">
            Join Dhanalakshmi Jewellery
          </p>

        </div>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="mb-3">

            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>

          <div className="mb-4">

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="btn jewellery-button w-100"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-4">

          <p className="mb-0">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="auth-link"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;