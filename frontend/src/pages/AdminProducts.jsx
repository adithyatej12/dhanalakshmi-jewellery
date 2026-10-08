import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminProducts() {

  const navigate = useNavigate();

  const emptyProduct = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: ""
  };

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load products
  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {

    try {

      const response =
        await API.get("/admin/products");

      setProducts(response.data);
      setLoading(false);

    } catch (error) {

      console.error(
        "ADMIN PRODUCTS ERROR:",
        error
      );

      if (error.response?.status === 403) {

        setError(
          "Access denied. Admin privileges are required."
        );

      } else if (error.response?.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");

        navigate("/login");

      } else {

        setError(
          "Unable to load products."
        );
      }

      setLoading(false);
    }
  };


  // Handle input
  const handleChange = (event) => {

    const { name, value } = event.target;

    setProduct((current) => ({
      ...current,
      [name]: value
    }));
  };


  // Open add form
  const openAddForm = () => {

    setProduct(emptyProduct);

    setEditingId(null);

    setError("");
    setSuccess("");

    setShowForm(true);
  };


  // Open edit form
  const openEditForm = (selectedProduct) => {

    setProduct({
      name: selectedProduct.name || "",
      description: selectedProduct.description || "",
      price: selectedProduct.price || "",
      stock: selectedProduct.stock || "",
      category: selectedProduct.category || "",
      imageUrl: selectedProduct.imageUrl || ""
    });

    setEditingId(selectedProduct.id);

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // Close form
  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);

    setProduct(emptyProduct);

    setError("");
  };


  // Save product
  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !product.name.trim() ||
      product.price === "" ||
      product.stock === ""
    ) {

      setError(
        "Product name, price and stock are required."
      );

      return;
    }


    if (Number(product.price) < 0) {

      setError(
        "Price cannot be negative."
      );

      return;
    }


    if (Number(product.stock) < 0) {

      setError(
        "Stock cannot be negative."
      );

      return;
    }


    setSaving(true);

    try {

      const productData = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),
        category: product.category,
        imageUrl: product.imageUrl
      };


      if (editingId) {

        const response =
          await API.put(
            `/admin/products/${editingId}`,
            productData
          );

        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            item.id === editingId
              ? response.data
              : item
          )
        );

        setSuccess(
          "Product updated successfully."
        );

      } else {

        const response =
          await API.post(
            "/admin/products",
            productData
          );

        setProducts((currentProducts) => [
          ...currentProducts,
          response.data
        ]);

        setSuccess(
          "Product added successfully."
        );
      }


      setProduct(emptyProduct);

      setEditingId(null);

      setShowForm(false);

    } catch (error) {

      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to save product."
      );

    } finally {

      setSaving(false);
    }
  };


  // Delete product
  const deleteProduct = async (productId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await API.delete(
        `/admin/products/${productId}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== productId
        )
      );

      setSuccess(
        "Product deleted successfully."
      );

    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to delete product."
      );
    }
  };


  // Logout
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };


  if (loading) {

    return (
      <div className="auth-page">

        <div className="text-center">

          <h3>
            Loading products...
          </h3>

        </div>

      </div>
    );
  }


  return (
    <div>

      {/* Navbar */}

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
              onClick={() =>
                navigate("/admin")
              }
            >
              Admin Dashboard
            </button>


            <button
              className="btn btn-outline-light"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* Main */}

      <section className="auth-page">

        <div className="container">

          {/* Header */}

          <div className="text-center mb-5">

            <div className="auth-logo">
              💎
            </div>

            <h1>
              Product Management
            </h1>

            <p className="text-muted">
              Add and manage Dhanalakshmi Jewellery products
            </p>

          </div>


          {/* Messages */}

          {error && (

            <div className="alert alert-danger">
              {error}
            </div>

          )}


          {success && (

            <div className="alert alert-success">
              {success}
            </div>

          )}


          {/* Add Button */}

          {!showForm && (

            <div className="text-end mb-4">

              <button
                className="btn jewellery-button"
                onClick={openAddForm}
              >
                + Add New Product
              </button>

            </div>

          )}


          {/* Product Form */}

          {showForm && (

            <div className="card product-card p-4 mb-5">

              <h4 className="mb-4">

                {editingId
                  ? "✏️ Edit Product"
                  : "➕ Add New Product"}

              </h4>


              <form onSubmit={handleSubmit}>

                <div className="row">


                  {/* Name */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Product Name *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      placeholder="Example: Gold Necklace"
                    />

                  </div>


                  {/* Category */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Category
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      placeholder="Example: Necklace"
                    />

                  </div>


                  {/* Price */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Price (₹) *
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="45000"
                    />

                  </div>


                  {/* Stock */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Stock *
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                      min="0"
                      placeholder="10"
                    />

                  </div>


                  {/* Description */}

                  <div className="col-12 mb-3">

                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe the jewellery product..."
                    />

                  </div>


                  {/* Image URL */}

                  <div className="col-12 mb-4">

                    <label className="form-label">
                      Image URL
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />

                  </div>


                  {/* Buttons */}

                  <div className="col-12">

                    <button
                      type="submit"
                      className="btn jewellery-button me-2"
                      disabled={saving}
                    >

                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Product"
                        : "Add Product"}

                    </button>


                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={closeForm}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </form>

            </div>

          )}


          {/* Products */}

          <div className="card product-card p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h4 className="mb-1">
                  💎 Jewellery Products
                </h4>

                <p className="text-muted mb-0">
                  {products.length} products in catalogue
                </p>

              </div>

            </div>


            {products.length === 0 ? (

              <div className="text-center py-5">

                <div
                  style={{
                    fontSize: "50px"
                  }}
                >
                  💎
                </div>

                <h5 className="mt-3">
                  No products found
                </h5>

                <p className="text-muted">
                  Add your first jewellery product.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Product</th>

                      <th>Category</th>

                      <th>Price</th>

                      <th>Stock</th>

                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody>

                    {products.map((item) => (

                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>


                        <td>

                          <strong>
                            {item.name}
                          </strong>

                          {item.description && (

                            <div>
                              <small className="text-muted">
                                {item.description.length > 60
                                  ? `${item.description.substring(
                                      0,
                                      60
                                    )}...`
                                  : item.description}
                              </small>
                            </div>

                          )}

                        </td>


                        <td>
                          {item.category || "-"}
                        </td>


                        <td>

                          <strong>
                            ₹
                            {Number(
                              item.price
                            ).toLocaleString("en-IN")}
                          </strong>

                        </td>


                        <td>

                          <span
                            className={
                              item.stock === 0
                                ? "badge bg-danger"
                                : item.stock <= 3
                                ? "badge bg-warning text-dark"
                                : "badge bg-success"
                            }
                          >
                            {item.stock}
                          </span>

                        </td>


                        <td>

                          <button
                            className="btn btn-sm btn-outline-dark me-2"
                            onClick={() =>
                              openEditForm(item)
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              deleteProduct(item.id)
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* Footer */}

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

export default AdminProducts;