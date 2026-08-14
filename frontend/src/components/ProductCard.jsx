import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
    return (
        <div className="product-card">

            <Link
                to={`/products/${product._id}`}
                className="product-card-image-link"
            >
                <div className="product-card-image">

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <div className="image-placeholder">
                            No Image
                        </div>
                    )}

                    <span className="category-badge">
                        {product.category}
                    </span>

                </div>
            </Link>


            <div className="product-card-content">

                <h2>{product.name}</h2>

                <p className="product-description">
                    {product.description}
                </p>


                <div className="product-card-footer">

                    <div className="product-price-section">

                        <span className="product-price">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {product.stock > 0 ? (
                            <span className="stock-status in-stock">
                                ● In Stock
                            </span>
                        ) : (
                            <span className="stock-status out-stock">
                                ● Out of Stock
                            </span>
                        )}

                    </div>


                    <Link
                        to={`/products/${product._id}`}
                        className="view-button"
                    >
                        View
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;