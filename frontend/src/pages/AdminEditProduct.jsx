import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminAddProduct.css";

function AdminEditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


 
    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/products/${id}`
                );

                const product = response.data.product;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price ?? "",
                    image: product.image || "",
                    category: product.category || "",
                    stock: product.stock ?? ""
                });

            } catch (error) {

                console.error(
                    "GET PRODUCT ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load product"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);


 
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

            setError(
                "Please fill all required fields"
            );

            return;
        }


        try {

            setSaving(true);

            const response = await api.put(
                `/products/${id}`,
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
                    "Product updated successfully!"
                );

            }

        } catch (error) {

            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update product"
            );

        } finally {

            setSaving(false);

        }

    };


 
    if (loading) {

        return (
            <div className="admin-add-product">

                <h2>
                    Loading product...
                </h2>

            </div>
        );

    }


 
    if (error && !formData.name) {

        return (
            <div className="admin-add-product">

                <div className="admin-form-error">
                    {error}
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
        );

    }


    return (

        <div className="admin-add-product">

            {/* HEADER */}

            <div className="admin-add-product-header">

                <div>

                    <h1>
                        Edit Product
                    </h1>

                    <p>
                        Update your product information
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


            {/* FORM CARD */}

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

                    {/* NAME */}

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


                    {/* DESCRIPTION */}

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


                    {/* PRICE + STOCK */}

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
                                min="0"
                            />

                        </div>

                    </div>


                    {/* CATEGORY */}

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


                    {/* IMAGE */}

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


                    {/* IMAGE PREVIEW */}

                    {formData.image && (

                        <div className="image-preview">

                            <p>
                                Image Preview
                            </p>

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


                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="create-product-btn"
                        disabled={saving}
                    >

                        {saving
                            ? "Updating Product..."
                            : "Update Product"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminEditProduct;