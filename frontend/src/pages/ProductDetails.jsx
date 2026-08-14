import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetails.css";

function ProductDetails() {

    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await api.get(
                    `/products/${id}`
                );

                setProduct(response.data.product);

            } catch (error) {

                setError("Product not found");

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);


    const handleQuantity = (value) => {

        if (!product) return;

        if (value < 1) return;

        if (value > product.stock) return;

        setQuantity(value);
    };


    const handleAddToCart = async () => {

        try {

            setAdding(true);

            await addToCart(
                product._id,
                quantity
            );

            alert("Product added to cart successfully!");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to add product"
            );

        } finally {

            setAdding(false);

        }
    };


    if (loading) {

        return (
            <div className="product-details-loading">

                <div className="loading-spinner"></div>

                <p>Loading product...</p>

            </div>
        );
    }


    if (error || !product) {

        return (
            <div className="product-details-error">

                <div className="error-icon">
                    !
                </div>

                <h2>Product Not Found</h2>

                <p>
                    Sorry, we couldn't find the product you're
                    looking for.
                </p>

                <Link to="/products">
                    ← Back to Products
                </Link>

            </div>
        );
    }


    const totalPrice = product.price * quantity;


    return (

        <div className="product-details-page">

            <div className="product-details-wrapper">

                {/* Breadcrumb */}

                <div className="breadcrumb">

                    <Link to="/">
                        Home
                    </Link>

                    <span>/</span>

                    <Link to="/products">
                        Products
                    </Link>

                    <span>/</span>

                    <span>
                        {product.name}
                    </span>

                </div>


                {/* Main Product Section */}

                <div className="product-details-card">


                    {/* LEFT SIDE */}

                    <div className="product-gallery">

                        <div className="main-image-wrapper">

                            {product.image ? (

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="main-product-image"
                                />

                            ) : (

                                <div className="no-product-image">
                                    No Image
                                </div>

                            )}

                            <span className="image-badge">
                                {product.category}
                            </span>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="product-information">

                        <div className="product-category">
                            {product.category}
                        </div>


                        <h1>
                            {product.name}
                        </h1>


                        <div className="product-rating">

                            <span className="stars">
                                ★★★★★
                            </span>

                            <span>
                                4.8
                            </span>

                            <span className="review-text">
                                (120 Reviews)
                            </span>

                        </div>


                        <div className="product-price">

                            ₹{product.price}

                        </div>


                        <div className="price-note">
                            Inclusive of all taxes
                        </div>


                        <div className="product-divider"></div>


                        <div className="product-description">

                            <h3>
                                Product Description
                            </h3>

                            <p>
                                {product.description}
                            </p>

                        </div>


                        {/* Stock */}

                        <div className="stock-section">

                            {product.stock > 0 ? (

                                <>
                                    <span className="stock-dot"></span>

                                    <span className="stock-text">
                                        In Stock
                                    </span>

                                    <span className="stock-count">
                                        {product.stock} available
                                    </span>
                                </>

                            ) : (

                                <span className="out-stock">
                                    Currently Out of Stock
                                </span>

                            )}

                        </div>


                        {/* Quantity */}

                        {product.stock > 0 && (

                            <div className="quantity-section">

                                <span>
                                    Quantity
                                </span>

                                <div className="quantity-control">

                                    <button
                                        onClick={() =>
                                            handleQuantity(
                                                quantity - 1
                                            )
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                    >
                                        −
                                    </button>


                                    <span>
                                        {quantity}
                                    </span>


                                    <button
                                        onClick={() =>
                                            handleQuantity(
                                                quantity + 1
                                            )
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* Total */}

                        {product.stock > 0 && (

                            <div className="purchase-summary">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{totalPrice}
                                </strong>

                            </div>

                        )}


                        {/* Buttons */}

                        <div className="product-actions">

                            <button
                                className="add-to-cart-button"
                                onClick={handleAddToCart}
                                disabled={
                                    product.stock <= 0 ||
                                    adding
                                }
                            >

                                {adding
                                    ? "Adding..."
                                    : "🛒 Add to Cart"}

                            </button>


                            <Link
                                to="/cart"
                                className="view-cart-button"
                            >
                                View Cart
                            </Link>

                        </div>


                        {/* Benefits */}

                        <div className="product-benefits">

                            <div className="benefit">

                                <div className="benefit-icon">
                                    🚚
                                </div>

                                <div>
                                    <strong>
                                        Free Delivery
                                    </strong>

                                    <span>
                                        On orders above ₹499
                                    </span>
                                </div>

                            </div>


                            <div className="benefit">

                                <div className="benefit-icon">
                                    ↩
                                </div>

                                <div>
                                    <strong>
                                        Easy Returns
                                    </strong>

                                    <span>
                                        7 day return policy
                                    </span>
                                </div>

                            </div>


                            <div className="benefit">

                                <div className="benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Secure Payment
                                    </strong>

                                    <span>
                                        100% secure checkout
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Back */}

                <Link
                    to="/products"
                    className="back-products"
                >
                    ← Continue Shopping
                </Link>

            </div>

        </div>
    );
}

export default ProductDetails;