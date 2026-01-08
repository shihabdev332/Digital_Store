import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from './layout/RootLayout'
import App from "./App"
import About from "./pages/About.jsx"
import Cart from "./pages/Cart.jsx"
import Contact from "./pages/Contact.jsx"
import Offers from "./pages/Offers.jsx"
import Order from "./pages/Order.jsx"
import Product from "./pages/Product.jsx"
import Profile from "./pages/Profile.jsx"
import Shop from "./pages/Shop.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import SingleProduct from "./pages/SingleProduct.jsx"
import SearchPage from "./component/SearchPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/about", element: <About /> },
      { path: "/cart", element: <Cart /> },
      { path: "/contact", element: <Contact /> },
      { path: "/offers", element: <Offers /> },
      { path: "/order", element: <Order /> },
      { path: "/product", element: <Product /> },
      { path: "/profile", element: <Profile /> },
      { path: "/shop", element: <Shop /> },
      { path: "/signIn", element: <SignIn /> },
      { path: "/signUp", element: <SignUp /> },
      { path: "/product/:id", element: <SingleProduct /> },
      { path: "/search", element: <SearchPage /> }, // ✅ Search route added
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
