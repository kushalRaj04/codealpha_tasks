import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminLayout.css";

function AdminLayout() {

    const { user, logout } = useAuth();

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                    <p>E-Commerce Store</p>
                </div>

                <nav className="admin-nav">

                    <Link to="/admin">
                        📊 Dashboard
                    </Link>

                    <Link to="/admin/products">
                        📦 Products
                    </Link>

                    <Link to="/admin/products/add">
                        ➕ Add Product
                    </Link>

                    <Link to="/admin/orders">
                        🛒 Orders
                    </Link>

                    <Link to="/admin/users">
                        👥 Users
                    </Link>

                </nav>

                <div className="admin-bottom">

                    <p>
                        Hello, {user?.name}
                    </p>

                    <Link to="/">
                        ← Back to Store
                    </Link>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}
            <main className="admin-main">

                <Outlet />

            </main>

        </div>
    );
}

export default AdminLayout;