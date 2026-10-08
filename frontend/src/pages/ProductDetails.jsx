import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    API.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading product:", error);
        setError("Unable to load product details.");
        setLoading(false);
      });

  }, [id]);


  // Loading state
  if (loading) {
    return (
      <div className="auth-page">
        <div className="text-center">
          <h3>Loading product...</h3>
        </div>
      </div>
    );
  }


  // Error state
  if (error || !product) {
    return (
      <div className="auth-page">

        <div className="text-center">

          <div className="alert alert-danger">
            {error || "Product not found."}
          </div>

          <button
            className="btn jewellery-button"
            onClick={() => navigate("/jewellery")}
          >
            Back to Jewellery
          </button>

        </div>

      </div>
    );
  }


  // Add product to cart
  const handleAddToCart = () => {

    // Get existing cart
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    // Check whether product already exists
    const existingItem = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingItem) {

      // Check stock limit
      if (existingItem.quantity >= product.stock) {
        alert("You cannot add more than the available stock.");
        return;
      }

      // Increase quantity
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

    } else {

      // Add new product
      updatedCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];

    }

    // Save cart
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    // Open cart
    navigate("/cart");
  };


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
              onClick={() => navigate("/jewellery")}
            >
              Jewellery
            </button>

            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/customer")}
            >
              My Account
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart
            </button>

          </div>

        </div>

      </nav>


      {/* =========================
          PRODUCT DETAILS
      ========================== */}

      <section className="products-section">

        <div className="container">

          <div className="row align-items-center">

            {/* Product Image */}

            <div className="col-md-6">

              <div className="product-details-image">

                <div className="product-details-placeholder">
                  💎
                </div>

              </div>

            </div>


            {/* Product Information */}

            <div className="col-md-6">

              <p className="section-subtitle">
                {product.category}
              </p>

              <h1 className="mb-3">
                {product.name}
              </h1>

              <p className="text-muted fs-5">
                {product.description}
              </p>

              <hr />

              <h2 className="product-price mb-4">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </h2>


              {/* Stock */}

              <p>

                <strong>
                  Availability:
                </strong>{" "}

                {product.stock > 0 ? (
                  <span className="text-success">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-danger">
                    Out of Stock
                  </span>
                )}

              </p>


              {/* Buttons */}

              <div className="mt-4">

                <button
                  className="btn jewellery-button me-2"
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>

                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate("/jewellery")}
                >
                  ← Back to Collection
                </button>

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

export default ProductDetails;