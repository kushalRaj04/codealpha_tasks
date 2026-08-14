import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminOrderDetails.css";

function AdminOrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


 
    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);

                const response = await api.get(
                    `/orders/${id}`
                );

                setOrder(response.data.order);

            } catch (error) {

                console.error(
                    "ADMIN ORDER DETAILS ERROR:",
                    error
                );

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


 
    if (loading) {

        return (
            <div className="admin-order-details-page">

                <h2>
                    Loading order...
                </h2>

            </div>
        );

    }


 
    if (error || !order) {

        return (
            <div className="admin-order-details-page">

                <div className="admin-order-details-error">
                    {error || "Order not found"}
                </div>

                <Link
                    to="/admin/orders"
                    className="back-admin-orders-btn"
                >
                    ← Back to Orders
                </Link>

            </div>
        );

    }


    return (

        <div className="admin-order-details-page">

            { }

            <div className="admin-order-details-header">

                <div>

                    <h1>
                        Order Details
                    </h1>

                    <p>
                        Order #{order._id}
                    </p>

                </div>


                <Link
                    to="/admin/orders"
                    className="back-admin-orders-btn"
                >
                    ← Back to Orders
                </Link>

            </div>


            { }

            <div className="admin-order-summary-card">

                <div>

                    <span className="detail-label">
                        Order Date
                    </span>

                    <strong>
                        {order.createdAt
                            ? new Date(
                                order.createdAt
                            ).toLocaleDateString()
                            : "-"}
                    </strong>

                </div>


                <div>

                    <span className="detail-label">
                        Status
                    </span>

                    <span
                        className={`admin-order-status ${String(
                            order.status || ""
                        )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        {order.status}
                    </span>

                </div>


                <div>

                    <span className="detail-label">
                        Total Amount
                    </span>

                    <strong className="order-total">
                        ₹
                        {Number(
                            order.totalAmount
                        ).toLocaleString()}
                    </strong>

                </div>

            </div>


            <div className="admin-order-details-grid">

                { }

                <div className="admin-details-card">

                    <h2>
                        Customer Information
                    </h2>

                    <div className="customer-detail">

                        <span>
                            Name
                        </span>

                        <strong>
                            {order.shippingAddress?.fullName ||
                                order.user?.name ||
                                "N/A"}
                        </strong>

                    </div>


                    <div className="customer-detail">

                        <span>
                            Email
                        </span>

                        <strong>
                            {order.user?.email ||
                                "N/A"}
                        </strong>

                    </div>


                    <div className="customer-detail">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {order.shippingAddress?.phone ||
                                "N/A"}
                        </strong>

                    </div>

                </div>


                { }

                <div className="admin-details-card">

                    <h2>
                        Shipping Address
                    </h2>

                    <div className="shipping-address">

                        <strong>
                            {order.shippingAddress?.fullName}
                        </strong>

                        <p>
                            {order.shippingAddress?.address}
                        </p>

                        <p>
                            {order.shippingAddress?.city}
                        </p>

                        <p>
                            Phone:{" "}
                            {order.shippingAddress?.phone}
                        </p>

                    </div>

                </div>

            </div>


            { }

            <div className="admin-details-card order-items-card">

                <h2>
                    Ordered Products
                </h2>


                <div className="admin-order-items">

                    {order.items?.map((item, index) => (

                        <div
                            className="admin-order-item"
                            key={
                                item.product?._id ||
                                index
                            }
                        >

                            {/* IMAGE */}

                            <div className="admin-order-item-image">

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

                                    <div>
                                        No Image
                                    </div>

                                )}

                            </div>


                            {/* PRODUCT */}

                            <div className="admin-order-item-info">

                                <h3>
                                    {item.name ||
                                        item.product?.name}
                                </h3>

                                <p>
                                    Price: ₹
                                    {Number(
                                        item.price
                                    ).toLocaleString()}
                                </p>

                            </div>


                            {/* QUANTITY */}

                            <div className="admin-order-item-quantity">

                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    {item.quantity}
                                </strong>

                            </div>


                            {/* TOTAL */}

                            <div className="admin-order-item-total">

                                ₹
                                {(
                                    Number(item.price) *
                                    Number(item.quantity)
                                ).toLocaleString()}

                            </div>

                        </div>

                    ))}

                </div>


                {/* TOTAL */}

                <div className="admin-items-total">

                    <span>
                        Order Total
                    </span>

                    <strong>
                        ₹
                        {Number(
                            order.totalAmount
                        ).toLocaleString()}
                    </strong>

                </div>

            </div>

        </div>
    );
}

export default AdminOrderDetails;