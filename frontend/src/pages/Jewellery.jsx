import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";

function Jewellery() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    API.get("/products")
      .then((response) => setProducts(response.data || []))
      .catch(() => setError("Unable to load jewellery collection."));
  }, []);

  // Deep-link support: /jewellery?category=Rings (used by Home tiles).
  // Only apply when the backend actually has that category.
  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (!fromUrl || products.length === 0) return;
    const known = new Set(
      products.map((p) => (p.category || "").toLowerCase())
    );
    const match = products
      .map((p) => p.category)
      .find((c) => c && c.toLowerCase() === fromUrl.toLowerCase());
    if (match && known.has(match.toLowerCase())) setActiveCategory(match);
  }, [searchParams, products]);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => p.category).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      const matchesQuery =
        !q ||
        `${p.name} ${p.description} ${p.category}`
          .toLowerCase()
          .includes(q);
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesQuery && matchesCategory;
    });

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, query, activeCategory, sort]);

  return (
    <div>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <p className="section-subtitle" style={{ color: "var(--gold-light)" }}>
            The Collection
          </p>
          <h1>Our Jewellery</h1>
          <p>
            Every piece is BIS-hallmarked, hand-finished, and made to be
            treasured for generations.
          </p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {/* Search */}
          <div className="filter-bar">
            <span style={{ color: "var(--gold-deep)" }}>⌕</span>
            <input
              type="text"
              placeholder="Search rings, necklaces, bangles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="form-select"
              style={{
                maxWidth: 170,
                border: "none",
                background: "transparent",
                fontSize: "0.88rem",
                color: "var(--muted)",
              }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </div>

          {/* Category chips */}
          <div className="chip-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {visible.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h4>No pieces found</h4>
              <p className="text-muted">
                Try a different search or category.
              </p>
              <button
                className="btn jewellery-button mt-3"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="row g-4">
            {visible.map((product, i) => (
              <div className="col-md-6 col-lg-3" key={product.id}>
                <Reveal delay={Math.min(i, 8) * 60} className="h-100">
                  <ProductCard product={product} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Jewellery;
