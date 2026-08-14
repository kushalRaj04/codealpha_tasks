import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await api.get(
                    "/orders/my-orders"
                );

                setOrders(
                    response.data.orders || []
                );

            } catch (error) {

                console.error(
                    "GET ORDERS ERROR:",
                    error
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

                <div className="orders-message">
                    <h2>Loading orders...</h2>
                </div>

            </div>
        );

    }


 
    if (error) {

        return (
            <div className="orders-page">

                <div className="orders-header">

                    <div>
                        <h1>My Orders</h1>

                        <p>
                            Track and manage your orders
                        </p>
                    </div>

                </div>

                <div className="orders-error">

                    <h2>{error}</h2>

                    <Link to="/products">
                        Continue Shopping
                    </Link>

                </div>

            </div>
        );

    }


 
    if (orders.length === 0) {

        return (
            <div className="orders-page">

                <div className="orders-header">

                    <div>
                        <h1>My Orders</h1>

                        <p>
                            Track and manage your orders
                        </p>
                    </div>

                </div>


                <div className="orders-empty">

                    <div className="empty-icon">
                        🛒
                    </div>

                    <h2>No orders yet</h2>

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

            </div>
        );

    }


 
    return (

        <div className="orders-page">

            {/* HEADER */}

            <div className="orders-header">

                <div>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        Track and manage your orders
                    </p>

                </div>


                <div className="orders-count">

                    {orders.length}{" "}

                    {orders.length === 1
                        ? "Order"
                        : "Orders"}

                </div>

            </div>


            {/* ORDER LIST */}

            <div className="orders-list">

                {orders.map((order) => (

                    <div
                        className="order-card"
                        key={order._id}
                    >

                        {/* TOP SECTION */}

                        <div className="order-top">

                            <div>

                                <span className="order-label">
                                    Order ID
                                </span>

                                <h3>
                                    #{order._id}
                                </h3>

                            </div>


                            <span
                                className={`order-status ${order.status
                                    ?.toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                            >
                                {order.status}
                            </span>

                        </div>


                        {/* ORDER INFORMATION */}

                        <div className="order-info">

                            <div className="order-info-item">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        order.totalAmount
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>


                            <div className="order-info-item">

                                <span>
                                    Items
                                </span>

                                <strong>
                                    {order.items?.length || 0}
                                </strong>

                            </div>


                            <div className="order-info-item">

                                <span>
                                    Order Date
                                </span>

                                <strong>

                                    {order.createdAt
                                        ? new Date(
                                            order.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "N/A"}

                                </strong>

                            </div>

                        </div>


                        {/* ACTION */}

                        <div className="order-actions">

                            <Link
                                to={`/orders/${order._id}`}
                                className="view-order-btn"
                            >
                                View Details →
                            </Link>

                        </div>

                    </div>

                ))}

            </div>


            {/* FOOTER */}

            <div className="orders-footer">

                <Link to="/products">
                    ← Continue Shopping
                </Link>

            </div>

        </div>
    );
}

export default Orders;