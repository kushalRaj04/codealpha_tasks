import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminUsers from "./pages/AdminUsers";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrderDetails from "./pages/AdminOrderDetails";


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <CartProvider>

                    <Routes>

                        { }

                        <Route
                            path="/*"
                            element={
                                <>
                                    <Navbar />

                                    <Routes>

                                        {/* Home */}
                                        <Route
                                            path="/"
                                            element={<Home />}
                                        />

                                        {/* Products */}
                                        <Route
                                            path="/products"
                                            element={<Products />}
                                        />

                                        {/* Product Details */}
                                        <Route
                                            path="/products/:id"
                                            element={<ProductDetails />}
                                        />

                                        {/* Cart */}
                                        <Route
                                            path="/cart"
                                            element={<Cart />}
                                        />

                                        {/* Checkout */}
                                        <Route
                                            path="/checkout"
                                            element={<Checkout />}
                                        />

                                        {/* My Orders */}
                                        <Route
                                            path="/orders"
                                            element={<Orders />}
                                        />

                                        {/* Order Details */}
                                        <Route
                                            path="/orders/:id"
                                            element={<OrderDetails />}
                                        />

                                        {/* Login */}
                                        <Route
                                            path="/login"
                                            element={<Login />}
                                        />

                                        {/* Register */}
                                        <Route
                                            path="/register"
                                            element={<Register />}
                                        />

                                    </Routes>
                                </>
                            }
                        />


                        { }
<Route
    path="/admin"
    element={<AdminLayout />}
>
    <Route
        index
        element={<AdminDashboard />}
    />

    <Route
        path="products"
        element={<AdminProducts />}
    />

    <Route
        path="products/add"
        element={<AdminAddProduct />}
    />

    <Route
        path="orders"
        element={<AdminOrders />}
    />
</Route>

<Route
    path="/admin/users"
    element={<AdminUsers />}
/>
<Route
    path="/admin/products/edit/:id"
    element={<AdminEditProduct />}
/>
<Route
    path="/admin/orders/:id"
    element={<AdminOrderDetails />}
/>
                    </Routes>

                </CartProvider>

            </AuthProvider>

        </BrowserRouter>

    );
}


export default App;