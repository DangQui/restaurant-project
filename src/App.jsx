import { Fragment } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
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
import { CartProvider } from "@/store/CartContext";

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
    ],
  },
]);

const App = () => {
  return (
    <CartProvider>
      <Fragment>
        <Toaster
          richColors
          position="bottom-right"
          closeButton
          duration={4000}
        />
        <RouterProvider router={router} />
      </Fragment>
    </CartProvider>
  );
};

export default App;
