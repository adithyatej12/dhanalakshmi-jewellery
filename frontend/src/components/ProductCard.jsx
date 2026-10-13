import { useNavigate } from "react-router-dom";
import { productImage } from "./productImages";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

/* Modern product card with real imagery. */
function ProductCard({ product, tag }) {
  const navigate = useNavigate();
  const src = productImage(product);

  const open = () => navigate(`/product/${product.id}`);

  return (
    <div className="card product-card h-100">
      <div className="product-image" onClick={open} style={{ cursor: "pointer" }}>
        {tag && <span className="product-tag">{tag}</span>}
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=70";
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="product-category">{product.category}</span>
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>

        <div className="product-foot mt-auto">
          <span className="product-price">{formatINR(product.price)}</span>
          <button className="view-link" onClick={open}>
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
export { formatINR };
