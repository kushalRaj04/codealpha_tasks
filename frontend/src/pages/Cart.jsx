import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

function Cart() {
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const { isLoggedIn } = useAuth();

    const [error, setError] = useState("");

    if (!isLoggedIn) {
        return (
            <div className="cart-page">
                <div className="cart-message">
                    <h1>Your Cart</h1>
                    <p>Please login to view your cart.</p>
                    <Link to="/login" className="primary-btn">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-page">
                <h2 className="cart-loading">Loading cart...</h2>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Looks like you haven't added anything to your cart yet.
                    </p>

                    <Link to="/products" className="primary-btn">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totalAmount = cart.items.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const handleRemove = async (productId) => {
        try {
            setError("");
            await removeFromCart(productId);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to remove product"
            );
        }
    };

    const handleClearCart = async () => {
        try {
            setError("");
            await clearCart();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to clear cart"
            );
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            setError("");

            if (newQuantity < 1) return;

            await updateQuantity(productId, newQuantity);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };

    return (
        <div className="cart-page">

            <div className="cart-header">
                <div>
                    <h1>Shopping Cart</h1>
                    <p>
                        {cart.items.length} item
                        {cart.items.length !== 1 ? "s" : ""} in your cart
                    </p>
                </div>

                <Link to="/products" className="continue-link">
                    ← Continue Shopping
                </Link>
            </div>

            {error && (
                <div className="cart-error">
                    {error}
                </div>
            )}

            <div className="cart-layout">

                {/* CART ITEMS */}
                <div className="cart-items">

                    {cart.items.map((item) => (

                        <div
                            className="cart-item"
                            key={item.product._id}
                        >

                            <div className="cart-product-image">

                                {item.product.image ? (
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image
                                    </div>
                                )}

                            </div>

                            <div className="cart-product-info">

                                <h2>
                                    {item.product.name}
                                </h2>

                                <p className="cart-category">
                                    {item.product.category}
                                </p>

                                <p className="cart-price">
                                    ₹{item.product.price}
                                </p>

                                <div className="quantity-section">

                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.product._id,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.product._id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <div className="cart-item-right">

                                <p className="item-total">
                                    ₹
                                    {(
                                        item.product.price *
                                        item.quantity
                                    ).toLocaleString()}
                                </p>

                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        handleRemove(item.product._id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}

                    <button
                        className="clear-cart-btn"
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </button>

                </div>

                {/* ORDER SUMMARY */}
                <div className="order-summary">

                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>
                            ₹{totalAmount.toLocaleString()}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free">
                            FREE
                        </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                        <span>Total</span>
                        <span>
                            ₹{totalAmount.toLocaleString()}
                        </span>
                    </div>

                    <Link
                        to="/checkout"
                        className="checkout-btn"
                    >
                        Proceed to Checkout
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart;