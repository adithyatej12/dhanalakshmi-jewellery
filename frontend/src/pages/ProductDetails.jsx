import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { productImage } from "../components/productImages";
import { formatINR } from "../components/ProductCard";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load product details.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;
    API.get("/products")
      .then((response) => {
        const others = (response.data || []).filter(
          (p) =>
            p.id !== product.id && p.category === product.category
        );
        setRelated(others.slice(0, 4));
      })
      .catch(() => setRelated([]));
  }, [product]);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("You cannot add more than the available stock.");
        return;
      }
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
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

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/cart");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="products-section">
          <div className="container text-center">
            <div className="spinner-border" style={{ color: "var(--gold)" }} />
            <p className="text-muted mt-3">Loading this piece…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="products-section">
          <div className="container text-center">
            <div className="alert alert-danger d-inline-block">
              {error || "Product not found."}
            </div>
            <div className="mt-3">
              <button
                className="btn jewellery-button"
                onClick={() => navigate("/jewellery")}
              >
                Back to Collection
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div>
      <Navbar />

      <section className="products-section">
        <div className="container">
          <Reveal>
            <button
              className="view-link mb-4"
              onClick={() => navigate("/jewellery")}
            >
              ← Back to Collection
            </button>
          </Reveal>

          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <Reveal>
                <div className="details-gallery">
                  <span className="product-tag">{product.category}</span>
                  <img
                    src={productImage(product)}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=70";
                    }}
                  />
                </div>
              </Reveal>
            </div>

            <div className="col-lg-6">
              <Reveal delay={120} className="details-info">
                <p className="breadcrumb-line">
                  Collection / {product.category}
                </p>
                <h1>{product.name}</h1>
                <div className="stars">★★★★★ <span className="text-muted" style={{letterSpacing:0}}>(4.9 · 200+ reviews)</span></div>
                <p className="details-desc mt-3">{product.description}</p>

                <div className="details-price">{formatINR(product.price)}</div>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Inclusive of all taxes · BIS Hallmarked
                </p>

                <div className="my-4">
                  {inStock ? (
                    <span className="stock-pill in">
                      <span className="dot" />
                      In Stock — {product.stock} available
                    </span>
                  ) : (
                    <span className="stock-pill out">
                      <span className="dot" />
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn jewellery-button"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn jewellery-button btn-outline-dark"
                    onClick={() => navigate("/cart")}
                  >
                    View Cart
                  </button>
                </div>

                <ul className="spec-list">
                  <li>
                    <span>Purity</span>
                    <strong>BIS Hallmarked 22K Gold</strong>
                  </li>
                  <li>
                    <span>Category</span>
                    <strong>{product.category}</strong>
                  </li>
                  <li>
                    <span>Exchange</span>
                    <strong>Lifetime exchange value</strong>
                  </li>
                  <li>
                    <span>Delivery</span>
                    <strong>Insured, 3–5 days</strong>
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-5 pt-4">
              <Reveal className="section-head" style={{ marginBottom: 36 }}>
                <p className="section-subtitle">You May Also Love</p>
                <h2>Similar Pieces</h2>
                <div className="gold-divider" />
              </Reveal>
              <div className="row g-4">
                {related.map((p) => (
                  <div className="col-md-6 col-lg-3" key={p.id}>
                    <div className="card product-card h-100">
                      <div
                        className="product-image"
                        onClick={() => navigate(`/product/${p.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={productImage(p)} alt={p.name} loading="lazy" />
                      </div>
                      <div className="card-body">
                        <span className="product-category">{p.category}</span>
                        <h5 className="card-title">{p.name}</h5>
                        <div className="product-foot">
                          <span className="product-price">
                            {formatINR(p.price)}
                          </span>
                          <button
                            className="view-link"
                            onClick={() => navigate(`/product/${p.id}`)}
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetails;
