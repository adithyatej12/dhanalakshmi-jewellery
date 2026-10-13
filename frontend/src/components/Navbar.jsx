import { Link, NavLink, useNavigate } from "react-router-dom";

/* Auth-aware sticky navbar shared by every page. */
function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const cartCount = (() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    } catch {
      return 0;
    }
  })();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("cart");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark jewellery-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark">✦</span>
          Dhanalakshmi&nbsp;Jewellery
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNavbar"
          aria-controls="siteNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="siteNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className={linkClass} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/jewellery">
                Collection
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/cart">
                <span className="nav-cart-badge">
                  Cart
                  {cartCount > 0 && (
                    <span className="nav-cart-count">{cartCount}</span>
                  )}
                </span>
              </NavLink>
            </li>

            {!token && (
              <>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {token && role === "ADMIN" && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/admin">
                  Admin
                </NavLink>
              </li>
            )}

            {token && role !== "ADMIN" && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/customer">
                  My Account
                </NavLink>
              </li>
            )}

            {token && (
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={logout}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
