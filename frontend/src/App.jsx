import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Menu from "./components/Menu";
import { loadUser } from "./redux/actions/userActions";
import store from "./redux/store";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import Settings from "./components/user/Settings";
import Cart from "./components/cart/Cart";
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
import ProtectedRoute from "./components/route/ProtectedRoute";
import ErrorPage from "./components/layout/ErrorPage";
import MetaSEO from "./components/layout/MetaSEO";
import ScrollToTopBtn from "./components/layout/ScrollToTopBtn";
import FloatingChatbot from "./components/ai/FloatingChatbot";
import coldStorageGuard from "./utils/coldStorageGuard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Always reset scroll to the top of the page on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // Load authenticated user if token is present
    store.dispatch(loadUser());
    // Start client-side cold storage keep-alive heartbeat
    coldStorageGuard.init();
  }, []);

  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
      <Router>
        <ScrollToTop />
        <MetaSEO />
        <div className="App">
          <Header />
          <main className="app-main-content">
            <Routes>
              {/* Public Routes - accessible with or without login */}
              <Route path="/" element={<Home />} exact />
              <Route path="/search" element={<Home />} />
              <Route path="/search/:keyword" element={<Home />} />
              <Route
                path="/eats/stores/search/:keyword"
                element={<Home />}
                exact
              />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/signup" element={<Register />} />

              {/* Protected User Routes - blocked from direct URL switching without login */}
              <Route
                path="/users/me"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/me/update"
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/me/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eats/orders/me/myOrders"
                element={
                  <ProtectedRoute>
                    <ListOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eats/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />

              {/* Universal 404 Not Found & Error Catch-all */}
              <Route
                path="*"
                element={
                  <ErrorPage
                    code="404"
                    title="Culinary Route Not Found"
                    message="The dish, kitchen, or page you requested does not exist on this server. Explore our trending dishes or return to the gourmet home."
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
          <ScrollToTopBtn />
          <FloatingChatbot />
        </div>
      </Router>
    </>
  );
}

export default App;
