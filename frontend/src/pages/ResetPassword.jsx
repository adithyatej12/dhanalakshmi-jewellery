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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Strong password validation
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      setSuccess(
        response.data || "Password reset successfully."
      );

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      setError(
        error.response?.data ||
        "Unable to reset password. Please try again."
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

          <h2>Reset Password</h2>

          <p className="text-muted">
            Reset your Dhanalakshmi Jewellery account password
          </p>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleResetPassword}>

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
              placeholder="Enter the OTP"
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

            <small className="text-muted">
              8+ characters with uppercase, lowercase,
              number and special character.
            </small>

          </div>

          <div className="mb-4">

            <label className="form-label">
              Confirm New Password
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
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>

        </form>

        <div className="text-center mt-4">

          <Link
            to="/login"
            className="auth-link"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;