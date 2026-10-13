import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import Reveal from "./components/Reveal";
import { CATEGORY_TILES } from "./components/productImages";

const TRUST_ITEMS = [
  { icon: "◈", title: "BIS Hallmarked", text: "Every gold piece certified for purity" },
  { icon: "✦", title: "Lifetime Exchange", text: "Transparent buyback, always" },
  { icon: "❖", title: "Handcrafted", text: "Made by master artisans since 1995" },
  { icon: "✧", title: "Insured Delivery", text: "Secure, doorstep delivery across India" },
];

const TESTIMONIALS = [
  {
    quote:
      "The bridal set I bought here made my wedding unforgettable. The craftsmanship is beyond anything I saw in the city.",
    name: "Priya Sharma",
    detail: "Bridal Collection, Chennai",
    initial: "P",
  },
  {
    quote:
      "Transparent pricing, BIS hallmark on every bill, and designs my grandmother would approve of. My family's jeweller now.",
    name: "Ananya Reddy",
    detail: "Gold Bangles, Hyderabad",
    initial: "A",
  },
  {
    quote:
      "Ordered a diamond pendant online and the insured delivery arrived in two days, beautifully packed. Flawless experience.",
    name: "Kavya Nair",
    detail: "Diamond Pendant, Bengaluru",
    initial: "K",
  },
];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => setProducts(response.data || []))
      .catch(() => setProducts([]));
  }, []);

  const featured = products.slice(0, 4);

  const goCategory = (name) =>
    navigate(`/jewellery?category=${encodeURIComponent(name)}`);

  return (
    <div>
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="hero-section">
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <Reveal>
            <span className="hero-kicker">Since 1995</span>
            <h1>
              Timeless Jewellery,
              <br />
              <em>Beautifully Crafted</em>
            </h1>
            <p className="hero-description">
              Discover heirloom-worthy gold and diamond jewellery — designed
              for weddings, festivals, and every moment in between.
            </p>
            <div className="hero-actions">
              <button
                className="btn jewellery-button"
                onClick={() => navigate("/jewellery")}
              >
                Explore Collection
              </button>
              <button
                className="hero-ghost"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </div>
          </Reveal>
        </div>
        <span className="hero-scroll">Scroll</span>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="products-section" style={{ paddingBottom: 40 }}>
        <div className="container">
          <Reveal className="section-head">
            <p className="section-subtitle">Shop by Category</p>
            <h2>Find Your Signature Piece</h2>
            <div className="gold-divider" />
          </Reveal>

          <div className="category-grid">
            {CATEGORY_TILES.map((tile, i) => (
              <Reveal key={tile.name} delay={i * 90}>
                <button
                  className="category-tile w-100"
                  onClick={() => goCategory(tile.name)}
                >
                  <img src={tile.src} alt={tile.name} loading="lazy" />
                  <div className="tile-label">
                    <span>{tile.tag}</span>
                    <h4>{tile.name}</h4>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      {featured.length > 0 && (
        <section className="products-section" style={{ paddingTop: 40 }}>
          <div className="container">
            <Reveal className="section-head">
              <p className="section-subtitle">Handpicked For You</p>
              <h2>Featured Pieces</h2>
              <p>
                A curated selection from our latest arrivals — each piece
                hallmarked and hand-finished by our artisans.
              </p>
              <div className="gold-divider" />
            </Reveal>

            <div className="row g-4">
              {featured.map((product, i) => (
                <div className="col-md-6 col-lg-3" key={product.id}>
                  <Reveal delay={i * 90} className="h-100">
                    <ProductCard
                      product={product}
                      tag={i === 0 ? "Bestseller" : i === 1 ? "New" : undefined}
                    />
                  </Reveal>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <button
                className="btn jewellery-button btn-outline-dark"
                onClick={() => navigate("/jewellery")}
              >
                View Full Collection →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============ TRUST STRIP ============ */}
      <section className="trust-strip">
        <div className="container">
          <div className="row g-4">
            {TRUST_ITEMS.map((item, i) => (
              <div className="col-6 col-lg-3" key={item.title}>
                <Reveal delay={i * 80}>
                  <div className="trust-item">
                    <div className="trust-icon">{item.icon}</div>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-card">
            <div className="row g-0">
              <div className="col-lg-5">
                <div className="about-media h-100">
                  <blockquote>
                    “Jewellery is not an ornament. It is memory, made to be
                    worn.”
                  </blockquote>
                </div>
              </div>
              <div className="col-lg-7">
                <Reveal className="about-body">
                  <p className="section-subtitle">Our Story</p>
                  <h2 className="mb-3">Three Decades of Golden Trust</h2>
                  <p className="about-text">
                    Founded in 1995, Dhanalakshmi Jewellery blends traditional
                    South Indian craftsmanship with contemporary design. Every
                    piece begins as a sketch in our studio and is hand-finished
                    by artisans whose skills span generations.
                  </p>
                  <p className="about-text">
                    From bridal trousseaus to everyday elegance, we craft
                    jewellery that celebrates life's most memorable occasions —
                    and lasts for generations after.
                  </p>
                  <div className="about-stats">
                    <div className="about-stat">
                      <b>30+</b>
                      <span>Years of craft</span>
                    </div>
                    <div className="about-stat">
                      <b>50k+</b>
                      <span>Happy families</span>
                    </div>
                    <div className="about-stat">
                      <b>100%</b>
                      <span>Hallmarked</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="products-section" style={{ paddingTop: 20 }}>
        <div className="container">
          <Reveal className="section-head">
            <p className="section-subtitle">Customer Love</p>
            <h2>Worn With Pride</h2>
            <div className="gold-divider" />
          </Reveal>

          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div className="col-md-4" key={t.name}>
                <Reveal delay={i * 100} className="h-100">
                  <div className="testimonial-card">
                    <span className="quote-mark">“</span>
                    <div className="stars mb-2">★★★★★</div>
                    <p>{t.quote}</p>
                    <div className="who">
                      <span className="avatar">{t.initial}</span>
                      <div>
                        <b>{t.name}</b>
                        <span>{t.detail}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{ padding: "20px 20px 100px" }}>
        <Reveal>
          <div className="cta-band">
            <p className="section-subtitle" style={{ color: "var(--gold-light)" }}>
              Begin Your Collection
            </p>
            <h2>Your Heirloom Awaits</h2>
            <p>
              Create a free account to save favourites, track orders, and get
              early access to festive collections.
            </p>
            <div className="hero-actions">
              <button
                className="btn jewellery-button"
                onClick={() => navigate("/register")}
              >
                Join Dhanalakshmi
              </button>
              <button
                className="hero-ghost"
                onClick={() => navigate("/jewellery")}
              >
                Browse Collection
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
