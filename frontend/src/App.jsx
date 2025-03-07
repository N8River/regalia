import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import TrendingPage from "./pages/CollectionPage/TrendingPage.jsx";
import NewArrivalsPage from "./pages/CollectionPage/NewArrivalsPage.jsx";
import AdminPage from "./pages/admin/admin.jsx";
import AdminAddProductPage from "./pages/admin/adminAddProductPage/adminAddProductPage.jsx";
import AdminEditProductPage from "./pages/admin/adminEditProductPage/adminEditProductPage.jsx";
import EarringsPage from "./pages/CollectionPage/EarringsPage.jsx";
import RingsPage from "./pages/CollectionPage/RingsPage.jsx";
import ChainsPage from "./pages/CollectionPage/ChainsPage.jsx";
import BraceletsPage from "./pages/CollectionPage/BraceletsPage.jsx";
import AllProductsPage from "./pages/CollectionPage/AllProductsPage.jsx";
import ProductDetailsPage from "./pages/CollectionPage/ProductDetailsPage.jsx";
import EditSingleProductPage from "./pages/admin/adminEditProductPage/editSingleProductPage/editSingleProduct.jsx";
import LoginUserPage from "./pages/user/login/loginUserPage.jsx";
import SignUpPage from "./pages/user/signup/signUpPage.jsx";
import AdminLoginPage from "./pages/admin/adminLoginPage/adminLoginPage.jsx";
import UnauthorizedPage from "./pages/unauthorizedPage/unauthorizedPage.jsx";
import PrivateRoute from "./routes/privateRoute.jsx";
import AccountPage from "./pages/user/account/accountPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AddressPage from "./pages/user/addressPage/addressPage.jsx";
import SearchResultsPage from "./pages/searchResultsPage/searchResultsPage.jsx";

import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Chatbot from "./components/chatbot/chatbot.jsx";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/collection/trending" element={<TrendingPage />} />
              <Route
                path="/collection/new-arrivals"
                element={<NewArrivalsPage />}
              />
              <Route path="/collection/earrings" element={<EarringsPage />} />
              <Route path="/collection/rings" element={<RingsPage />} />
              <Route path="/collection/bracelets" element={<BraceletsPage />} />
              <Route path="/collection/chains" element={<ChainsPage />} />
              <Route
                path="/collection/all-products"
                element={<AllProductsPage />}
              />
              <Route
                path="/collection/:productId"
                element={<ProductDetailsPage />}
              />
              <Route path="/search" element={<SearchResultsPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<PrivateRoute adminOnly={true} element={AdminPage} />}
              />

              <Route
                path="/admin/add-product"
                element={
                  <PrivateRoute
                    adminOnly={true}
                    element={AdminAddProductPage}
                  />
                }
              />
              <Route
                path="/admin/edit-product"
                element={
                  <PrivateRoute
                    adminOnly={true}
                    element={AdminEditProductPage}
                  />
                }
              />
              <Route
                path="/admin/edit-product/:productId"
                element={
                  <PrivateRoute
                    adminOnly={true}
                    element={EditSingleProductPage}
                  />
                }
              />

              {/* User Routes */}
              <Route path="/account/login" element={<LoginUserPage />} />
              <Route path="/account/signup" element={<SignUpPage />} />
              <Route
                path="/account/"
                element={
                  <PrivateRoute adminOnly={false} element={AccountPage} />
                }
              />
              <Route
                path="/account/:orderId"
                element={<PrivateRoute adminOnly={false} element={OrderPage} />}
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute adminOnly={false} element={CheckoutPage} />
                }
              />
              <Route
                path="/account/address"
                element={
                  <PrivateRoute adminOnly={false} element={AddressPage} />
                }
              />

              {/* Unauthorized Route */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
            <Chatbot />
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
