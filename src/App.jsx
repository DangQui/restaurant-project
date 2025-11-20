import { Fragment } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { CartProvider } from "@/store/CartContext";
import { AuthProvider } from "@/store/AuthContext";

import MainLayout from "@/layouts/MainLayout/MainLayout";

import HomePage from "@/pages/Home/Home";
import AboutPage from "@/pages/About/About";
import ContactPage from "@/pages/Contact/Contact";
import MenuPage from "@/pages/Menu/Menu";
import ProductPage from "@/pages/Product/Product";
import SearchPage from "@/pages/Search/Search";
import CartPage from "@/pages/Cart/Cart";
import CheckoutPage from "@/pages/Checkout/Checkout";
import ReservationPage from "@/pages/Reservation/Reservation";
import ProfilePage from "@/pages/Profile/Profile";
import OrdersPage from "@/pages/Orders/Orders";
import SettingsPage from "@/pages/Settings/Settings";
import TrackingPage from "@/pages/Tracking/Tracking";
import AuthDialog from "@/components/AuthDialog/AuthDialog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "menu/:productId", element: <ProductPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "reservation", element: <ReservationPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "tracking", element: <TrackingPage /> },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Fragment>
          <Toaster
            richColors
            position="bottom-right"
            closeButton
            duration={4000}
          />
          <RouterProvider router={router} />
          <AuthDialog />
        </Fragment>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
