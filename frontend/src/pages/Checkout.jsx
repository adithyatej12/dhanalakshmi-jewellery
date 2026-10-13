import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    if (savedCart.length === 0) {

      navigate("/cart");

      return;
    }

    setCart(savedCart);

  }, [navigate]);


  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
      item.quantity,
    0
  );


  const handlePlaceOrder = async (event) => {

    event.preventDefault();

    setError("");

    if (!address.trim()) {

      setError(
        "Please enter your delivery address."
      );

      return;
    }

    if (!phone.trim()) {

      setError(
        "Please enter your phone number."
      );

      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {

      setError(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    setLoading(true);


    try {

      // Create an order for every cart item
      for (const item of cart) {

        await API.post(
          "/orders",
          {
            productId: item.id,
            quantity: item.quantity,
            address: address,
            phone: phone
          }
        );
      }


      // Clear cart after successful orders
      localStorage.removeItem("cart");


      // Go to customer dashboard
      navigate("/customer");


    } catch (error) {

      console.error(
        "ORDER ERROR:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to place your order. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div>

      <Navbar />


      {/* Checkout */}

      <section className="page-hero">

        <div className="container">

          <p className="section-subtitle" style={{ color: "var(--gold-light)" }}>
            Almost Yours
          </p>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your jewellery order — insured delivery, always.
          </p>

        </div>

      </section>


      <section className="products-section">

        <div className="container">


          {error && (

            <div className="alert alert-danger mb-4">

              {error}

            </div>

          )}


          <div className="row justify-content-center">


            {/* Delivery Form */}

            <div className="col-md-6 mb-4">

              <div className="panel-card lux-form">

                <h4 className="mb-4">
                  <span className="panel-icon">📦</span> Delivery Details
                </h4>


                <form onSubmit={handlePlaceOrder}>


                  <div className="mb-4">

                    <label className="form-label">
                      Delivery Address
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      value={address}
                      onChange={(event) =>
                        setAddress(
                          event.target.value
                        )
                      }
                      placeholder="Enter your complete delivery address"
                    />

                  </div>


                  <div className="mb-4">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      placeholder="10-digit phone number"
                      maxLength="10"
                    />

                  </div>


                  <button
                    type="submit"
                    className="btn jewellery-button w-100"
                    disabled={loading}
                  >

                    {loading
                      ? "Placing Order..."
                      : "Place Order"}

                  </button>


                </form>

              </div>

            </div>


            {/* Order Summary */}

            <div className="col-md-5 mb-4">

              <div className="panel-card lux-form">

                <h4 className="mb-4">
                  <span className="panel-icon">🛒</span> Order Summary
                </h4>


                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex justify-content-between mb-3"
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <div className="text-muted">
                        Quantity: {item.quantity}
                      </div>

                    </div>


                    <div>

                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toLocaleString("en-IN")}

                    </div>

                  </div>

                ))}


                <hr />


                <div className="d-flex justify-content-between">

                  <strong>
                    Total
                  </strong>

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <Footer />

    </div>
  );
}

export default Checkout;