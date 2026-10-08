import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await API.get("/admin/orders");

      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);

      if (error.response?.status === 403) {
        setError("Access denied. Admin privileges are required.");
      } else {
        setError("Unable to load orders.");
      }

      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      await API.put(
        `/admin/orders/${orderId}/status`,
        {
          status: newStatus
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus
              }
            : order
        )
      );
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      alert(
        error.response?.data ||
        "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  const placedOrders = orders.filter(
    (order) => order.status === "PLACED"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  if (loading) {
    return (
      <div className="auth-page">
        <div className="text-center">
          <h3>Loading admin dashboard...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="container">

          <div className="alert alert-danger text-center">
            {error}
          </div>

          <div className="text-center">
            <button
              className="btn btn-dark"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Navbar */}

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
              onClick={() => navigate("/customer")}
            >
              Customer Dashboard
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

      {/* Dashboard */}

      <section className="auth-page">

        <div className="container">

          <div className="text-center mb-5">

            <div className="auth-logo">
              💎
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p className="text-muted">
              Manage Dhanalakshmi Jewellery orders
            </p>

          </div>

          {/* Statistics */}

          <div className="row mb-5">

            <div className="col-md-3 mb-3">
              <div className="card product-card p-4 text-center">

                <h6 className="text-muted">
                  TOTAL ORDERS
                </h6>

                <h2>
                  {orders.length}
                </h2>

              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card product-card p-4 text-center">

                <h6 className="text-muted">
                  REVENUE
                </h6>

                <h2>
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h2>

              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card product-card p-4 text-center">

                <h6 className="text-muted">
                  PLACED
                </h6>

                <h2>
                  {placedOrders}
                </h2>

              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card product-card p-4 text-center">

                <h6 className="text-muted">
                  DELIVERED
                </h6>

                <h2>
                  {deliveredOrders}
                </h2>

              </div>
            </div>

          </div>

          {/* Orders */}

          <div className="card product-card p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h4 className="mb-1">
                  📦 All Orders
                </h4>

                <p className="text-muted mb-0">
                  View and manage customer orders
                </p>

              </div>

              <span className="badge bg-dark">
                {confirmedOrders} Confirmed
              </span>

            </div>

            {orders.length === 0 ? (

              <div className="text-center py-5">

                <div style={{ fontSize: "50px" }}>
                  📦
                </div>

                <h5 className="mt-3">
                  No orders yet
                </h5>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>

                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Order Date</th>

                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr key={order.id}>

                        <td>
                          <strong>
                            #{order.id}
                          </strong>
                        </td>

                        {/* Customer */}

                        <td>

                          <div>
                            <strong>
                              {order.customerName || "Customer"}
                            </strong>
                          </div>

                          <small className="text-muted">
                            {order.customerEmail || ""}
                          </small>

                        </td>

                        {/* Product */}

                        <td>
                          {order.productName}
                        </td>

                        {/* Quantity */}

                        <td>
                          {order.quantity}
                        </td>

                        {/* Total */}

                        <td>

                          <strong>
                            ₹
                            {Number(
                              order.totalAmount || 0
                            ).toLocaleString("en-IN")}
                          </strong>

                        </td>

                        {/* Phone */}

                        <td>
                          {order.phone}
                        </td>

                        {/* Status */}

                        <td>

                          <select
                            className="form-select"
                            value={order.status}
                            disabled={
                              updatingId === order.id
                            }
                            onChange={(event) =>
                              updateStatus(
                                order.id,
                                event.target.value
                              )
                            }
                          >

                            <option value="PLACED">
                              PLACED
                            </option>

                            <option value="CONFIRMED">
                              CONFIRMED
                            </option>

                            <option value="SHIPPED">
                              SHIPPED
                            </option>

                            <option value="DELIVERED">
                              DELIVERED
                            </option>

                            <option value="CANCELLED">
                              CANCELLED
                            </option>

                          </select>

                        </td>

                        {/* Order Date */}

                        <td>

                          {new Date(
                            order.orderDate
                          ).toLocaleDateString(
                            "en-IN"
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* Footer */}

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

export default AdminDashboard;