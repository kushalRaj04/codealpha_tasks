import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


 
    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/orders/admin/all"
            );

            setOrders(response.data.orders || []);

        } catch (error) {

            console.error(
                "ADMIN ORDERS ERROR:",
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


    useEffect(() => {

        fetchOrders();

    }, []);


 
    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            const response = await api.put(
                `/orders/admin/${orderId}`,
                {
                    status: newStatus
                }
            );

            if (response.data.success) {

                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? {
                                ...order,
                                status:
                                    response.data.order.status
                            }
                            : order
                    )
                );

            }

        } catch (error) {

            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );

        }
    };


 
    if (loading) {

        return (
            <div className="admin-orders-page">

                <h2>
                    Loading orders...
                </h2>

            </div>
        );

    }


 
    if (error) {

        return (
            <div className="admin-orders-page">

                <h1>
                    Manage Orders
                </h1>

                <div className="admin-order-error">
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="admin-orders-page">

            {/* HEADER */}

            <div className="admin-orders-header">

                <div>

                    <h1>
                        Manage Orders
                    </h1>

                    <p>
                        {orders.length} orders placed
                    </p>

                </div>

            </div>


            {/* NO ORDERS */}

            {orders.length === 0 ? (

                <div className="no-orders">

                    <h2>
                        No orders found
                    </h2>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>

            ) : (

                <div className="admin-orders-table-wrapper">

                    <table className="admin-orders-table">

                        <thead>

                            <tr>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Items
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {orders.map((order) => (

                                <tr
                                    key={order._id}
                                >

                                    {/* ORDER ID */}

                                    <td>

                                        <span className="order-id">
                                            #{order._id.slice(-6)}
                                        </span>

                                    </td>


                                    {/* CUSTOMER */}

                                    <td>

                                        <div className="customer-info">

                                            <strong>
                                                {order.shippingAddress?.fullName ||
                                                    order.user?.name ||
                                                    "Customer"}
                                            </strong>

                                            <span>
                                                {order.shippingAddress?.phone ||
                                                    order.user?.email ||
                                                    ""}
                                            </span>

                                        </div>

                                    </td>


                                    {/* ITEMS */}

                                    <td>
                                        {order.items?.length || 0}
                                    </td>


                                    {/* TOTAL */}

                                    <td>

                                        <strong>
                                            ₹
                                            {Number(
                                                order.totalAmount
                                            ).toLocaleString()}
                                        </strong>

                                    </td>


                                    {/* DATE */}

                                    <td>

                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <select
                                            className={`order-status ${String(
                                                order.status || ""
                                            )
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )}`}
                                            value={
                                                order.status
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </td>


                                    {/* VIEW */}

                                    <td>

                                      <Link
    to={`/admin/orders/${order._id}`}
    className="view-order-btn"
>
    View
</Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default AdminOrders;