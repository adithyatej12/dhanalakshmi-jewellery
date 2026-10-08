import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

import ProtectedRoute from "./pages/ProtectedRoute";

import Jewellery from "./pages/Jewellery";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Routes>

      {/* =========================
          HOME
      ========================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =========================
          AUTHENTICATION
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =========================
          JEWELLERY
      ========================= */}

      <Route
        path="/jewellery"
        element={<Jewellery />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />


      {/* =========================
          SHOPPING
      ========================= */}

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />


      {/* =========================
          CUSTOMER DASHBOARD
      ========================= */}

      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN PRODUCT MANAGEMENT
      ========================= */}

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;