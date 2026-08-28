import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminProducts.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const response = await api.get("/products");

            setProducts(response.data.products || []);

        } catch (error) {

            console.error("ADMIN PRODUCTS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProducts();

    }, []);


 
    const handleDelete = async (productId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/products/${productId}`);

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) => product._id !== productId
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );

        }
    };


 
    if (loading) {

        return (
            <div className="admin-products-page">

                <h2>Loading products...</h2>

            </div>
        );

    }


 
    if (error) {

        return (
            <div className="admin-products-page">

                <h1>Manage Products</h1>

                <div className="admin-error">
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="admin-products-page">

            {/* HEADER */}

            <div className="admin-products-header">

                <div>

                    <h1>Manage Products</h1>

                    <p>
                        {products.length} products in your store
                    </p>

                </div>


                <Link
                    to="/admin/products/add"
                    className="add-product-btn"
                >
                    + Add Product
                </Link>

            </div>


            {/* NO PRODUCTS */}

            {products.length === 0 ? (

                <div className="no-products">

                    <h2>No products found</h2>

                    <p>
                        Start by adding your first product.
                    </p>

                    <Link
                        to="/admin/products/add"
                        className="add-product-btn"
                    >
                        Add Product
                    </Link>

                </div>

            ) : (

                <div className="admin-products-table-wrapper">

                    <table className="admin-products-table">

                        <thead>

                            <tr>

                                <th>Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {products.map((product) => (

                                <tr key={product._id}>

                                    {/* IMAGE */}

                                    <td>

                                        {product.image ? (

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="admin-product-image"
                                            />

                                        ) : (

                                            <div className="admin-no-image">
                                                No Image
                                            </div>

                                        )}

                                    </td>


                                    {/* PRODUCT */}

                                    <td>

                                        <div className="admin-product-name">

                                            <strong>
                                                {product.name}
                                            </strong>

                                            <span>
                                                {product.description}
                                            </span>

                                        </div>

                                    </td>


                                    {/* CATEGORY */}

                                    <td>
                                        {product.category}
                                    </td>


                                    {/* PRICE */}

                                    <td>
                                        ₹{product.price.toLocaleString()}
                                    </td>


                                    {/* STOCK */}

                                    <td>

                                        <span
                                            className={
                                                product.stock > 0
                                                    ? "stock-available"
                                                    : "stock-empty"
                                            }
                                        >
                                            {product.stock}
                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div className="admin-product-actions">

                                            {/* VIEW */}

                                            <Link
                                                to={`/products/${product._id}`}
                                                className="view-btn"
                                            >
                                                View
                                            </Link>


                                            {/* EDIT */}

                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>


                                            {/* DELETE */}

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

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

export default AdminProducts;