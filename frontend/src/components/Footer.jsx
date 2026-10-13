import { Link } from "react-router-dom";

/* Rich footer shared by every page. */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="footer-brand">
              <span className="brand-mark">✦</span>
              Dhanalakshmi Jewellery
            </div>
            <p>
              Timeless jewellery, handcrafted with tradition since 1995.
              Every piece is BIS-hallmarked and crafted to be treasured
              for generations.
            </p>
          </div>

          <div className="col-md-3">
            <h5>Explore</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/jewellery">Collection</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/customer">My Account</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Our Promise</h5>
            <ul className="footer-links">
              <li>BIS Hallmarked Gold</li>
              <li>Lifetime Exchange Value</li>
              <li>Certified Natural Diamonds</li>
              <li>Insured Doorstep Delivery</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2026 Dhanalakshmi Jewellery. All rights reserved.
          </p>
          <p className="copyright">
            Crafted with tradition · Worn with pride
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
