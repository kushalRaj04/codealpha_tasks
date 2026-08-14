import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import "../styles/Checkout.css";

function Checkout() {
    const { cart, loading } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        phone: ""
    });

    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    if (loading) {
        return (
            <div className="checkout-page">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <h1>Your Cart is Empty</h1>

                    <p>
                        Add some products before proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="checkout-shopping-btn"
                    >
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setPlacingOrder(true);

            const response = await api.post(
                "/orders",
                formData
            );

            alert(
                response.data.message ||
                "Order placed successfully"
            );

            navigate("/orders");

        } catch (error) {

            console.error(
                "ORDER ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to place order"
            );

        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="checkout-page">

            <div className="checkout-container">

                <div className="checkout-header">
                    <Link
                        to="/cart"
                        className="back-cart"
                    >
                        ← Back to Cart
                    </Link>

                    <h1>Checkout</h1>

                    <p>
                        Complete your details to place your order.
                    </p>
                </div>


                {error && (
                    <div className="checkout-error">
                        {error}
                    </div>
                )}


                <div className="checkout-layout">

                    {/* DELIVERY FORM */}

                    <div className="checkout-form-card">

                        <h2>Delivery Information</h2>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your delivery address"
                                    rows="4"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="place-order-btn"
                                disabled={placingOrder}
                            >
                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"}
                            </button>

                        </form>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="checkout-summary">

                        <h2>Order Summary</h2>

                        <div className="checkout-products">

                            {cart.items.map((item) => (

                                <div
                                    className="checkout-product"
                                    key={item.product._id}
                                >

                                    <div className="checkout-product-image">

                                        {item.product.image ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                            />
                                        ) : (
                                            <div>
                                                No Image
                                            </div>
                                        )}

                                    </div>


                                    <div className="checkout-product-info">

                                        <h3>
                                            {item.product.name}
                                        </h3>

                                        <p>
                                            ₹{item.product.price}
                                        </p>

                                        <span>
                                            Quantity: {item.quantity}
                                        </span>

                                    </div>


                                    <strong>
                                        ₹
                                        {(
                                            item.product.price *
                                            item.quantity
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                            ))}

                        </div>


                        <div className="checkout-divider"></div>


                        <div className="checkout-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹{totalAmount.toLocaleString()}
                            </span>

                        </div>


                        <div className="checkout-row">

                            <span>
                                Shipping
                            </span>

                            <span className="free-shipping">
                                FREE
                            </span>

                        </div>


                        <div className="checkout-divider"></div>


                        <div className="checkout-total">

                            <span>
                                Total
                            </span>

                            <span>
                                ₹{totalAmount.toLocaleString()}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;