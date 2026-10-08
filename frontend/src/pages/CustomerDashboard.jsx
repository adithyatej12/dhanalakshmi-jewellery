import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    // Load customer profile
    API.get("/customer/profile")
      .then((response) => {
        console.log("PROFILE RESPONSE:", response.data);
        setProfile(response.data);
      })
      .catch((error) => {
        console.error(
          "PROFILE ERROR:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          logout();
          return;
        }

        setError("Unable to load customer profile.");
      });

    // Load customer orders
    API.get("/orders")
      .then((response) => {
        console.log("ORDERS RESPONSE:", response.data);
        setOrders(response.data);
        setOrdersLoading(false);
      })
      .catch((error) => {
        console.error(
          "ORDERS ERROR:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          logout();
          return;
        }

        setOrdersLoading(false);
      });
  }, []);

  // Logout
  const logout = () => {
    // Remove authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    // Clear shopping cart
    localStorage.removeItem("cart");

    // Redirect to login
    navigate("/login", { replace: true });
  };

  // Loading profile
  if (!profile && !error) {
    return (
      <div className="auth-page">
        <div className="text-center">
          <h3>Loading customer profile...</h3>
        </div>
      </div>
    );
  }

  // Profile error
  if (error) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="alert alert-danger text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="navbar navbar-dark jewellery-navbar">
        <div className="container">
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            💎 Dhanalakshmi Jewellery
          </span>

          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/jewellery")}
            >
              Jewellery
            </button>

            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart
            </button>

            <button
              className="btn btn-outline-light"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* =========================
          DASHBOARD
      ========================== */}

      <section className="auth-page">
        <div className="container">

          {/* Welcome */}

          <div className="text-center">
            <div className="auth-logo">
              💎
            </div>

            <h1>
              Welcome, {profile.name}
            </h1>

            <p className="lead">
              {profile.email}
            </p>

            <p className="text-muted">
              Welcome to your Dhanalakshmi Jewellery account.
            </p>
          </div>

          {/* =========================
              PROFILE + COLLECTION
          ========================== */}

          <div className="row justify-content-center mt-5">

            {/* Profile */}

            <div className="col-md-5 mb-4">
              <div className="card product-card p-4 h-100">

                <h4 className="mb-4">
                  👤 My Profile
                </h4>

                <p>
                  <strong>
                    Name:
                  </strong>{" "}
                  {profile.name}
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {profile.email}
                </p>

                <p>
                  <strong>
                    Account Type:
                  </strong>{" "}
                  {profile.role}
                </p>

                <p>
                  <strong>
                    Email Verified:
                  </strong>{" "}

                  {profile.verified ? (
                    <span className="text-success">
                      Yes ✓
                    </span>
                  ) : (
                    <span className="text-danger">
                      No
                    </span>
                  )}
                </p>

              </div>
            </div>

            {/* Jewellery */}

            <div className="col-md-5 mb-4">
              <div className="card product-card p-4 h-100">

                <h4>
                  💎 Jewellery Collection
                </h4>

                <p className="text-muted">
                  Browse our latest jewellery collection.
                </p>

                <button
                  className="btn jewellery-button"
                  onClick={() => navigate("/jewellery")}
                >
                  Browse Jewellery
                </button>

              </div>
            </div>

          </div>

          {/* =========================
              MY ORDERS
          ========================== */}

          <div className="row justify-content-center mt-3">
            <div className="col-md-10">

              <div className="card product-card p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <h4 className="mb-0">
                    📦 My Orders
                  </h4>

                  <button
                    className="btn btn-outline-dark"
                    onClick={() => navigate("/jewellery")}
                  >
                    Continue Shopping
                  </button>

                </div>

                {/* Loading */}

                {ordersLoading && (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      Loading your orders...
                    </p>
                  </div>
                )}

                {/* No Orders */}

                {!ordersLoading && orders.length === 0 && (
                  <div className="text-center py-4">

                    <div style={{ fontSize: "50px" }}>
                      📦
                    </div>

                    <h5 className="mt-3">
                      No orders yet
                    </h5>

                    <p className="text-muted">
                      Your jewellery orders will appear here.
                    </p>

                    <button
                      className="btn jewellery-button"
                      onClick={() => navigate("/jewellery")}
                    >
                      Browse Jewellery
                    </button>

                  </div>
                )}

                {/* Orders */}

                {!ordersLoading && orders.length > 0 && (
                  <div className="table-responsive">

                    <table className="table align-middle">

                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Order Date</th>
                        </tr>
                      </thead>

                      <tbody>

                        {orders.map((order) => (
                          <tr key={order.id}>

                            <td>
                              #{order.id}
                            </td>

                            <td>
                              <strong>
                                {order.productName}
                              </strong>
                            </td>

                            <td>
                              {order.quantity}
                            </td>

                            <td>
                              ₹
                              {Number(order.totalAmount)
                                .toLocaleString("en-IN")}
                            </td>

                            <td>
                              <span className="badge bg-success">
                                {order.status}
                              </span>
                            </td>

                            <td>
                              {new Date(
                                order.orderDate
                              ).toLocaleDateString("en-IN")}
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="footer">
        <div className="container text-center">

          <h5>
            💎 Dhanalakshmi Jewellery
          </h5>

          <p>
            Timeless elegance. Crafted with tradition.
          </p>

          <p className="copyright">
            © 2026 Dhanalakshmi Jewellery
          </p>

        </div>
      </footer>

    </div>
  );
}

export default CustomerDashboard;