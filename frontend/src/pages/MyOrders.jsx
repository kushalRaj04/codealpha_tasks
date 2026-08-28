import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);

                const response = await api.get("/orders/my-orders");

                console.log("ORDERS:", response.data);

                setOrders(response.data.orders || []);

            } catch (error) {
                console.error(
                    "FAILED TO LOAD ORDERS:",
                    error.response?.data || error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-page">
                <h2>Loading orders...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-error">
                    <h2>{error}</h2>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">

            <div className="orders-header">
                <div>
                    <h1>My Orders</h1>
                    <p>
                        {orders.length} order
                        {orders.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <Link
                    to="/products"
                    className="continue-shopping"
                >
                    ← Continue Shopping
                </Link>
            </div>

            {orders.length === 0 ? (

                <div className="no-orders">

                    <div className="no-orders-icon">
                        📦
                    </div>

                    <h2>No Orders Yet</h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/products"
                        className="shop-btn"
                    >
                        Start Shopping
                    </Link>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <div className="order-card-header">

                                <div>
                                    <h2>
                                        Order #
                                        {order._id.slice(-6).toUpperCase()}
                                    </h2>

                                    <p>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <span
                                    className={`order-status ${order.status?.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>

                            </div>

                            <div className="order-items">

                                {order.items.map((item, index) => (

                                    <div
                                        className="order-item"
                                        key={index}
                                    >

                                        <div className="order-item-image">

                                            {item.product?.image ? (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.name}
                                                />
                                            ) : (
                                                <span>📦</span>
                                            )}

                                        </div>

                                        <div className="order-item-info">

                                            <h3>
                                                {item.name}
                                            </h3>

                                            <p>
                                                Quantity: {item.quantity}
                                            </p>

                                            <p>
                                                ₹
                                                {item.price.toLocaleString()}
                                            </p>

                                        </div>

                                        <div className="order-item-total">

                                            ₹
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString()}

                                        </div>

                                    </div>

                                ))}

                            </div>

                            <div className="order-card-footer">

                                <div>
                                    <span>Total Amount</span>

                                    <strong>
                                        ₹
                                        {order.totalAmount.toLocaleString()}
                                    </strong>
                                </div>

                                <Link
                                    to={`/orders/${order._id}`}
                                    className="view-order-btn"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyOrders;