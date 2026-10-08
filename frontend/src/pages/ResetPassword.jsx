import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState(
    localStorage.getItem("resetEmail") || ""
  );

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {

      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMessage(
        "Password reset successfully. Redirecting to login..."
      );

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Unable to reset password."
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
            Reset Password
          </h2>

          <p className="text-muted">
            Enter the OTP sent to your email
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

          <div className="mb-3">

            <label className="form-label">
              OTP
            </label>

            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value)
              }
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              New Password
            </label>

            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              placeholder="Enter new password"
              required
            />

          </div>

          <div className="mb-4">

            <label className="form-label">
              Confirm Password
            </label>

            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
              required
            />

          </div>

          <button
            type="submit"
            className="btn jewellery-button w-100"
            disabled={loading}
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
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

export default ResetPassword;