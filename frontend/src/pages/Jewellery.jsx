import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Jewellery() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    API.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error loading jewellery:", error);
        setError("Unable to load jewellery collection.");
      });

  }, []);

  return (
    <div>

      {/* =========================
          NAVIGATION
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
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/customer")}
            >
              My Account
            </button>

          </div>

        </div>

      </nav>


      {/* =========================
          COLLECTION
      ========================== */}

      <section className="products-section">

        <div className="container">

          <div className="text-center mb-5">

            <p className="section-subtitle">
              DHANALAKSHMI JEWELLERY
            </p>

            <h1>
              Our Collection
            </h1>

            <p className="text-muted">
              Discover jewellery crafted for life's most special moments.
            </p>

          </div>


          {/* Error Message */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          {/* =========================
              PRODUCT CARDS
          ========================== */}

          <div className="row g-4">

            {products.map((product) => (

              <div
                className="col-md-6 col-lg-3"
                key={product.id}
              >

                <div className="card product-card h-100">

                  {/* Product Image */}

                  <div className="product-image">

                    <div className="placeholder-image">
                      💎
                    </div>

                  </div>


                  {/* Product Information */}

                  <div className="card-body d-flex flex-column">

                    <small className="text-muted">
                      {product.category}
                    </small>

                    <h5 className="card-title mt-2">
                      {product.name}
                    </h5>

                    <p className="card-text text-muted">
                      {product.description}
                    </p>


                    {/* Price + View */}

                    <div className="mt-auto">

                      <div className="d-flex justify-content-between align-items-center">

                        <span className="product-price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>

                        <button
                          className="btn jewellery-button"
                          onClick={() =>
                            navigate(`/product/${product.id}`)
                          }
                        >
                          View
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

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

export default Jewellery;