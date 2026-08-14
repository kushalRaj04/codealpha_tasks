import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchStats = async () => {

            try {

                const response = await api.get(
                    "/orders/admin/stats"
                );

                setStats(response.data.stats);

            } catch (error) {

                console.error(
                    "ADMIN DASHBOARD ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchStats();

    }, []);


    return (
        <div className="admin-dashboard">

            {/* HEADER */}

            <div className="admin-dashboard-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p className="admin-welcome">
                        Welcome to your e-commerce
                        administration panel.
                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="admin-dashboard-error">
                    {error}
                </div>
            )}


            {/* STATISTICS */}

            <div className="admin-cards">


                {/* PRODUCTS */}

                <div className="admin-card">

                    <div className="admin-card-icon">
                        📦
                    </div>

                    <div>

                        <h3>
                            Products
                        </h3>

                        <strong className="admin-stat">

                            {loading
                                ? "..."
                                : stats.totalProducts
                            }

                        </strong>

                        <p>
                            Products in your store
                        </p>

                    </div>

                </div>


                {/* USERS */}

                <div className="admin-card">

                    <div className="admin-card-icon">
                        👥
                    </div>

                    <div>

                        <h3>
                            Users
                        </h3>

                        <strong className="admin-stat">

                            {loading
                                ? "..."
                                : stats.totalUsers
                            }

                        </strong>

                        <p>
                            Registered customers
                        </p>

                    </div>

                </div>


                {/* ORDERS */}

                <div className="admin-card">

                    <div className="admin-card-icon">
                        🛒
                    </div>

                    <div>

                        <h3>
                            Orders
                        </h3>

                        <strong className="admin-stat">

                            {loading
                                ? "..."
                                : stats.totalOrders
                            }

                        </strong>

                        <p>
                            Total customer orders
                        </p>

                    </div>

                </div>


                {/* PENDING ORDERS */}

                <div className="admin-card">

                    <div className="admin-card-icon">
                        ⏳
                    </div>

                    <div>

                        <h3>
                            Pending Orders
                        </h3>

                        <strong className="admin-stat">

                            {loading
                                ? "..."
                                : stats.pendingOrders
                            }

                        </strong>

                        <p>
                            Orders waiting for processing
                        </p>

                    </div>

                </div>


                {/* REVENUE */}

                <div className="admin-card">

                    <div className="admin-card-icon">
                        💰
                    </div>

                    <div>

                        <h3>
                            Revenue
                        </h3>

                        <strong className="admin-stat">

                            {loading
                                ? "..."
                                : `₹${Number(
                                    stats.totalRevenue
                                ).toLocaleString()}`
                            }

                        </strong>

                        <p>
                            Total store revenue
                        </p>

                    </div>

                </div>


            </div>

        </div>
    );
}

export default AdminDashboard;