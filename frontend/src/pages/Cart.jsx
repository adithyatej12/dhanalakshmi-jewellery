import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { productImage } from "../components/productImages";
import { formatINR } from "../components/ProductCard";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    updateCart(
      cart.map((item) =>
        item.id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <p className="section-subtitle" style={{ color: "var(--gold-light)" }}>
            Your Selection
          </p>
          <h1>Shopping Cart</h1>
          <p>
            {itemCount === 0
              ? "Your cart is waiting for something beautiful."
              : `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} reserved for you.`}
          </p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {cart.length === 0 ? (
            <Reveal>
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <h3>Your cart is empty</h3>
                <p className="text-muted">
                  Discover our jewellery collection and add something beautiful.
                </p>
                <button
                  className="btn jewellery-button mt-3"
                  onClick={() => navigate("/jewellery")}
                >
                  Browse Jewellery
                </button>
              </div>
            </Reveal>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="d-flex flex-column gap-3">
                  {cart.map((item, i) => (
                    <Reveal key={item.id} delay={Math.min(i, 5) * 70}>
                      <div className="cart-item">
                        <img
                          className="cart-thumb"
                          src={productImage(item)}
                          alt={item.name}
                          onClick={() => navigate(`/product/${item.id}`)}
                          style={{ cursor: "pointer" }}
                        />

                        <div className="flex-grow-1">
                          <span className="product-category">
                            {item.category}
                          </span>
                          <h5
                            className="mb-1 mt-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h5>
                          <span className="product-price">
                            {formatINR(item.price)}
                          </span>
                          <div className="mt-2">
                            <span className="qty-stepper">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => increaseQuantity(item.id)}
                                disabled={item.quantity >= item.stock}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </span>
                            <small className="text-muted ms-3">
                              {item.stock} available
                            </small>
                          </div>
                        </div>

                        <div className="text-end">
                          <strong style={{ fontFamily: "var(--font-display)" }}>
                            {formatINR(Number(item.price) * item.quantity)}
                          </strong>
                          <br />
                          <button
                            className="btn btn-sm btn-link text-danger mt-2 p-0"
                            style={{ fontSize: "0.82rem" }}
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <button
                  className="view-link mt-4"
                  onClick={() => navigate("/jewellery")}
                >
                  ← Continue Shopping
                </button>
              </div>

              <div className="col-lg-4">
                <Reveal delay={120}>
                  <div className="summary-card">
                    <h4>Order Summary</h4>
                    <div className="summary-row">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span style={{ color: "#9fd6a4" }}>FREE</span>
                    </div>
                    <div className="summary-row">
                      <span>Insurance</span>
                      <span>Included</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    <button
                      className="btn jewellery-button w-100 mt-4"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </button>
                    <p
                      className="text-center mt-3 mb-0"
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(243,233,215,0.6)",
                      }}
                    >
                      Secure checkout · BIS hallmarked pieces
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Cart;
