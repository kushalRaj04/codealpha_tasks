import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminAddProduct.css";

function AdminAddProduct() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.description ||
            formData.price === "" ||
            !formData.category ||
            formData.stock === ""
        ) {
            setError("Please fill all required fields");
            return;
        }


        try {

            setLoading(true);

            const response = await api.post(
                "/products",
                {
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    image: formData.image,
                    category: formData.category,
                    stock: Number(formData.stock)
                }
            );


            if (response.data.success) {

                setSuccess(
                    "Product created successfully!"
                );

                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    category: "",
                    stock: ""
                });

            }

        } catch (error) {

            console.error(
                "ADD PRODUCT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create product"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="admin-add-product">

            <div className="admin-add-product-header">

                <div>

                    <h1>Add Product</h1>

                    <p>
                        Add a new product to your store
                    </p>

                </div>

                <button
                    className="back-products-btn"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    ← Back to Products
                </button>

            </div>


            <div className="admin-product-form-card">

                {error && (
                    <div className="admin-form-error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="admin-form-success">
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Product Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description *
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="5"
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Price (₹) *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="799"
                                min="0"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Stock *
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="20"
                                min="0"
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Category *
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Fashion"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Image URL
                        </label>

                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/product.jpg"
                        />

                    </div>


                    

                    {formData.image && (

                        <div className="image-preview">

                            <p>Image Preview</p>

                            <img
                                src={formData.image}
                                alt="Product preview"
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";
                                }}
                            />

                        </div>

                    )}


                    <button
                        type="submit"
                        className="create-product-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Product..."
                            : "Create Product"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminAddProduct;