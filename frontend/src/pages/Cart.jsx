import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {

    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);

  }, []);


  const updateCart = (updatedCart) => {

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        if (item.quantity < item.stock) {

          return {
            ...item,
            quantity: item.quantity + 1,
          };

        }

      }

      return item;

    });

    updateCart(updatedCart);

  };


  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id === id) {

          return {
            ...item,
            quantity: item.quantity - 1,
          };

        }

        return item;

      })
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);

  };


  const removeItem = (id) => {

    const updatedCart =
      cart.filter((item) => item.id !== id);

    updateCart(updatedCart);

  };


  const calculateSubtotal = () => {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price) * item.quantity,
      0
    );

  };


  const subtotal = calculateSubtotal();


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
              onClick={() => navigate("/customer")}
            >
              My Account
            </button>


            <button
              className="btn btn-light"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart ({cart.length})
            </button>

          </div>

        </div>

      </nav>


      {/* =========================
          CART
      ========================== */}

      <section className="products-section">

        <div className="container">


          {/* Heading */}

          <div className="text-center mb-5">

            <p className="section-subtitle">
              DHANALAKSHMI JEWELLERY
            </p>

            <h1>
              Shopping Cart
            </h1>

            <p className="text-muted">
              Review your selected jewellery before checkout.
            </p>

          </div>


          {/* Empty Cart */}

          {cart.length === 0 ? (

            <div className="text-center py-5">

              <div style={{ fontSize: "70px" }}>
                🛒
              </div>

              <h3 className="mt-4">
                Your cart is empty
              </h3>

              <p className="text-muted">
                Discover our jewellery collection
                and add something beautiful.
              </p>

              <button
                className="btn jewellery-button mt-3"
                onClick={() => navigate("/jewellery")}
              >
                Browse Jewellery
              </button>

            </div>

          ) : (

            <div className="row">


              {/* =========================
                  CART ITEMS
              ========================== */}

              <div className="col-lg-8">

                {cart.map((item) => (

                  <div
                    className="card product-card mb-3"
                    key={item.id}
                  >

                    <div className="card-body">

                      <div className="row align-items-center">


                        {/* Product Image */}

                        <div className="col-md-2 text-center">

                          <div className="placeholder-image">
                            💎
                          </div>

                        </div>


                        {/* Product Details */}

                        <div className="col-md-4">

                          <small className="text-muted">
                            {item.category}
                          </small>

                          <h5 className="mt-1">
                            {item.name}
                          </h5>

                          <p className="product-price mb-0">

                            ₹
                            {Number(item.price)
                              .toLocaleString("en-IN")}

                          </p>

                        </div>


                        {/* Quantity */}

                        <div className="col-md-3 mt-3 mt-md-0">

                          <label className="form-label">
                            Quantity
                          </label>


                          <div className="d-flex align-items-center">

                            <button
                              className="btn btn-outline-dark"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                            >
                              −
                            </button>


                            <span
                              className="px-3 fw-bold"
                              style={{
                                minWidth: "45px",
                                textAlign: "center"
                              }}
                            >
                              {item.quantity}
                            </span>


                            <button
                              className="btn btn-outline-dark"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              disabled={
                                item.quantity >= item.stock
                              }
                            >
                              +
                            </button>

                          </div>


                          <small className="text-muted">
                            {item.stock} available
                          </small>

                        </div>


                        {/* Item Total */}

                        <div className="col-md-3 text-md-end mt-3 mt-md-0">

                          <strong>

                            ₹
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toLocaleString("en-IN")}

                          </strong>


                          <br />


                          <button
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >
                            🗑 Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* =========================
                  ORDER SUMMARY
              ========================== */}

              <div className="col-lg-4">

                <div className="card product-card p-4">

                  <h4 className="mb-4">
                    Order Summary
                  </h4>


                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </strong>

                  </div>


                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Shipping
                    </span>

                    <span className="text-success">
                      FREE
                    </span>

                  </div>


                  <hr />


                  <div className="d-flex justify-content-between mb-4">

                    <h5>
                      Total
                    </h5>

                    <h5 className="product-price">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </h5>

                  </div>


                  {/* CHECKOUT BUTTON */}

                  <button
                    className="btn jewellery-button w-100"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>


                  <button
                    className="btn btn-outline-dark w-100 mt-2"
                    onClick={() => navigate("/jewellery")}
                  >
                    Continue Shopping
                  </button>

                </div>

              </div>

            </div>

          )}

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

export default Cart;