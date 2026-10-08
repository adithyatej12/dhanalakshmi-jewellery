import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {

  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await API.post("/auth/verify-otp", {
        email: email,
        otp: otp,
      });

      setMessage(response.data);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "OTP verification failed."
      );
    }
  };

  const handleResend = async () => {

    setMessage("");
    setError("");

    try {

      const response = await API.post("/auth/resend-otp", {
        email: email,
        otp: "",
      });

      setMessage(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Unable to resend OTP."
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
            Verify Your Email
          </h2>

          <p className="text-muted">
            Enter the OTP sent to your email
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

        <form onSubmit={handleVerify}>

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

          <div className="mb-4">

            <label className="form-label">
              Verification OTP
            </label>

            <input
              type="text"
              className="form-control text-center"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value)
              }
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              inputMode="numeric"
              required
            />

          </div>

          <button
            type="submit"
            className="btn jewellery-button w-100"
          >
            Verify Email
          </button>

        </form>

        <button
          type="button"
          onClick={handleResend}
          className="btn btn-link w-100 mt-3"
        >
          Resend OTP
        </button>

        <div className="text-center mt-2">

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

export default VerifyOtp;