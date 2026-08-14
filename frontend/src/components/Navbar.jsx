import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {

    const {
        user,
        isLoggedIn,
        logout
    } = useAuth();

    return (
        <nav>

            <h2>
                <Link to="/">
                    E-Commerce Store
                </Link>
            </h2>

            <div>

                <Link to="/">
                    Home
                </Link>

                {" | "}

                <Link to="/products">
                    Products
                </Link>

                {" | "}

                <Link to="/cart">
                    Cart
                </Link>


                {/* USER LINKS */}

                {isLoggedIn && (
                    <>
                        {" | "}

                        <Link to="/orders">
                            My Orders
                        </Link>
                    </>
                )}


                {/* ADMIN LINKS */}

                {isLoggedIn && user?.role === "admin" && (
                    <>
                        {" | "}

                        <Link to="/admin/orders">
                            Admin Orders
                        </Link>
                    </>
                )}


                {/* LOGIN / REGISTER */}

                {!isLoggedIn ? (

                    <>

                        {" | "}

                        <Link to="/login">
                            Login
                        </Link>

                        {" | "}

                        <Link to="/register">
                            Register
                        </Link>

                    </>

                ) : (

                    <>

                        {" | "}

                        <span>
                            Hello, {user?.name}
                        </span>

                        {" | "}

                        <button onClick={logout}>
                            Logout
                        </button>

                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;