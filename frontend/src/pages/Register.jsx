import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/users/register",
                formData
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Create Account</h1>

                    <p>
                        Join us and start shopping
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {message && (
                        <div className="auth-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login here
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;