import { useEffect, useState } from "react";
import axios from "axios";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

  }, []);

  return (
    <div>

      {/* =========================
          NAVIGATION BAR
      ========================= */}

      <nav className="navbar navbar-expand-lg navbar-dark jewellery-navbar">

        <div className="container">

          <a className="navbar-brand fw-bold" href="/">
            💎 Dhanalakshmi Jewellery
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >

            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#collection"
                >
                  Jewellery
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#about"
                >
                  About Us
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/login"
                >
                  Login
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/register"
                >
                  Register
                </a>
              </li>

            </ul>

          </div>

        </div>

      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero-section">

        <div className="container text-center">

          <p className="hero-small-text">
            SINCE 1995
          </p>

          <h1>
            Timeless Jewellery,
            <br />
            Beautifully Crafted
          </h1>

          <p className="hero-description">
            Discover elegant jewellery crafted for every
            special moment at Dhanalakshmi Jewellery.
          </p>

          <a
            href="#collection"
            className="btn jewellery-button"
          >
            Explore Collection
          </a>

        </div>

      </section>


      {/* =========================
          PRODUCT COLLECTION
      ========================= */}

      <section
        id="collection"
        className="products-section"
      >

        <div className="container">

          <div className="text-center mb-5">

            <p className="section-subtitle">
              OUR COLLECTION
            </p>

            <h2>
              Discover Our Jewellery
            </h2>

            <p className="text-muted">
              Explore our carefully selected collection
              of timeless pieces.
            </p>

          </div>


          <div className="row g-4">

            {products.map((product) => (

              <div
                className="col-md-6 col-lg-3"
                key={product.id}
              >

                <div className="card product-card h-100">

                  <div className="product-image">

                    <div className="placeholder-image">
                      💎
                    </div>

                  </div>


                  <div className="card-body">

                    <small className="text-muted">
                      {product.category}
                    </small>

                    <h5 className="card-title mt-2">
                      {product.name}
                    </h5>

                    <p className="card-text text-muted">
                      {product.description}
                    </p>


                    <div className="d-flex justify-content-between align-items-center">

                      <span className="product-price">
                        ₹
                        {Number(product.price)
                          .toLocaleString("en-IN")}
                      </span>

                      <button
                        className="btn btn-sm jewellery-button"
                      >
                        View
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================
          ABOUT SECTION
      ========================= */}

      <section
        id="about"
        className="about-section"
      >

        <div className="container text-center">

          <p className="section-subtitle">
            ABOUT US
          </p>

          <h2>
            The Dhanalakshmi Jewellery Story
          </h2>

          <p className="about-text">
            Dhanalakshmi Jewellery brings together
            traditional craftsmanship and contemporary
            elegance. Our collection is designed to
            celebrate life's most memorable occasions
            with jewellery that lasts for generations.
          </p>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div className="container text-center">

          <h5>
            💎 Dhanalakshmi Jewellery
          </h5>

          <p className="mb-0">
            Timeless elegance. Crafted with tradition.
          </p>

          <p className="copyright">
            © 2026 Dhanalakshmi Jewellery.
            All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;