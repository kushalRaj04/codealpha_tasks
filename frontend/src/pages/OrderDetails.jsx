import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/OrderDetails.css";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
   const [cancelling, setCancelling] = useState(false);
     useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);

                setOrder(response.data.order);
            } catch (error) {
                console.error("Failed to load order:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load order"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

     

const handleCancelOrder = async () => {

    const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
        return;
    }

    try {

        setCancelling(true);

        const response = await api.put(
            `/orders/${order._id}/cancel`
        );

        setOrder(response.data.order);

        alert("Order cancelled successfully");

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Failed to cancel order"
        );

    } finally {

        setCancelling(false);

    }
};
     if (loading) {
        return (
            <div className="order-details-page">
                <div className="order-loading">
                    <h2>Loading order...</h2>
                </div>
            </div>
        );
    }

     if (error && !order) {
        return (
            <div className="order-details-page">
                <div className="order-error">
                    <h2>{error}</h2>

                    <Link to="/orders">
                        ← Back to My Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-details-page">
                <div className="order-error">
                    <h2>Order not found</h2>

                    <Link to="/orders">
                        ← Back to My Orders
                    </Link>
                </div>
            </div>
        );
    }

    const canCancel =
        order.status === "Pending" ||
        order.status === "Processing";

    return (
        <div className="order-details-page">

            { }

            <div className="order-details-header">

                <div>

                    <Link
                        to="/orders"
                        className="back-orders"
                    >
                        ← Back to My Orders
                    </Link>

                    <h1>Order Details</h1>

                    <p>
                        Order #{order._id}
                    </p>

                </div>

                <div
                    className={`details-status ${order.status?.toLowerCase()}`}
                >
                    {order.status}
                </div>

            </div>


            { }

            {error && (
                <div className="order-action-error">
                    {error}
                </div>
            )}


            { }

            <div className="order-info-card">

                <div className="order-info">

                    <span>Order Date</span>

                    <strong>
                        {new Date(
                            order.createdAt
                        ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}
                    </strong>

                </div>

                <div className="order-info">

                    <span>Order Status</span>

                    <strong>
                        {order.status}
                    </strong>

                </div>

                <div className="order-info">

                    <span>Total Items</span>

                    <strong>
                        {order.items.reduce(
                            (total, item) =>
                                total + item.quantity,
                            0
                        )}
                    </strong>

                </div>

            </div>


            { }

            <div className="order-details-layout">


                { }

                <div className="order-products-card">

                    <h2>
                        Ordered Products
                    </h2>

                    <div className="order-products">

                        {order.items.map(
                            (item, index) => (

                                <div
                                    className="order-product"
                                    key={index}
                                >

                                    <div className="order-product-image">

                                        {item.product?.image ? (

                                            <img
                                                src={
                                                    item.product.image
                                                }
                                                alt={
                                                    item.name
                                                }
                                            />

                                        ) : (

                                            <div className="no-order-image">
                                                No Image
                                            </div>

                                        )}

                                    </div>


                                    <div className="order-product-info">

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p>
                                            ₹
                                            {item.price.toLocaleString()}
                                            {" "}×{" "}
                                            {item.quantity}
                                        </p>

                                        <span>
                                            Quantity:{" "}
                                            {item.quantity}
                                        </span>

                                    </div>


                                    <div className="order-product-total">

                                        ₹
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString()}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                { }

                <div className="order-right-column">


                    {/* SHIPPING ADDRESS */}

                    <div className="shipping-card">

                        <h2>
                            Shipping Address
                        </h2>

                        <div className="shipping-details">

                            <strong>
                                {
                                    order.shippingAddress
                                        ?.fullName
                                }
                            </strong>

                            <p>
                                {
                                    order.shippingAddress
                                        ?.address
                                }
                            </p>

                            <p>
                                {
                                    order.shippingAddress
                                        ?.city
                                }
                            </p>

                            <p>
                                Phone:{" "}
                                {
                                    order.shippingAddress
                                        ?.phone
                                }
                            </p>

                        </div>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="details-summary">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="details-summary-row">

                            <span>
                                Items
                            </span>

                            <span>
                                {order.items.reduce(
                                    (total, item) =>
                                        total +
                                        item.quantity,
                                    0
                                )}
                            </span>

                        </div>

                        <div className="details-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹
                                {order.totalAmount.toLocaleString()}
                            </span>

                        </div>

                        <div className="details-summary-row">

                            <span>
                                Shipping
                            </span>

                            <span className="free-text">
                                FREE
                            </span>

                        </div>

                        <div className="details-divider"></div>

                        <div className="details-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {order.totalAmount.toLocaleString()}
                            </strong>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="order-actions">

                        <button
                            className="continue-shopping-btn"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Continue Shopping
                        </button>


                        {canCancel && (

                            <button
                                className="cancel-order-btn"
                                onClick={
                                    handleCancelOrder
                                }
                                disabled={cancelling}
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;