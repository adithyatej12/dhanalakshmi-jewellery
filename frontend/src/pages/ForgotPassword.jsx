import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {

      await API.post("/auth/forgot-password", {
        email,
      });

      // Store email temporarily for the reset page
      localStorage.setItem("resetEmail", email);

      setMessage(
        "OTP sent successfully. Please check your email."
      );

      // Go to reset password page
      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Unable to send password reset OTP."
      );

    } finally {

      setLoading(false);
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
            Forgot Password?
          </h2>

          <p className="text-muted">
            Enter your email to reset your password
          </p>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

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
              placeholder="Enter your registered email"
              required
            />

          </div>

          <button
            type="submit"
            className="btn jewellery-button w-100"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        <div className="text-center mt-4">

          <Link
            to="/login"
            className="auth-link"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;