import { Link } from "react-router-dom";
import "../styles/Home.css";


function Home() {
    return (
        <div className="home-page">

            {/* HERO SECTION */}

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-tag">
                        ✨ Welcome to our store
                    </span>

                    <h1>
                        Shop Smart.
                        <br />
                        Live Better.
                    </h1>

                    <p>
                        Discover quality products at great prices.
                        Everything you need, all in one place.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/products"
                            className="shop-button"
                        >
                            Shop Now →
                        </Link>

                        <Link
                            to="/products"
                            className="explore-button"
                        >
                            Explore Products
                        </Link>

                    </div>

                </div>


                <div className="hero-image">

                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
                        alt="Shopping store"
                    />

                </div>

            </section>


            {/* FEATURES */}

            <section className="features-section">

                <div className="feature">

                    <div className="feature-icon">
                        🚚
                    </div>

                    <div>
                        <h3>Fast Delivery</h3>

                        <p>
                            Quick and reliable delivery
                        </p>
                    </div>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        🔒
                    </div>

                    <div>
                        <h3>Secure Payment</h3>

                        <p>
                            Your payments are protected
                        </p>
                    </div>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        ⭐
                    </div>

                    <div>
                        <h3>Quality Products</h3>

                        <p>
                            Products you'll love
                        </p>
                    </div>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        💬
                    </div>

                    <div>
                        <h3>Customer Support</h3>

                        <p>
                            We're here to help
                        </p>
                    </div>

                </div>

            </section>


            {/* CATEGORY SECTION */}

            <section className="category-section">

                <div className="section-heading">

                    <div>
                        <span>
                            SHOP BY CATEGORY
                        </span>

                        <h2>
                            Find what you need
                        </h2>
                    </div>

                    <Link to="/products">
                        View All →
                    </Link>

                </div>


                <div className="category-grid">

                    <Link
                        to="/products"
                        className="category-card"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
                            alt="Clothing"
                        />

                        <div>
                            <h3>Clothing</h3>
                            <p>Explore fashion</p>
                        </div>
                    </Link>


                    <Link
                        to="/products"
                        className="category-card"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                            alt="Accessories"
                        />

                        <div>
                            <h3>Accessories</h3>
                            <p>Complete your look</p>
                        </div>
                    </Link>


                    <Link
                        to="/products"
                        className="category-card"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80"
                            alt="Electronics"
                        />

                        <div>
                            <h3>Electronics</h3>
                            <p>Latest technology</p>
                        </div>
                    </Link>

                </div>

            </section>


            {/* CTA */}

            <section className="home-cta">

                <div>

                    <h2>
                        Ready to start shopping?
                    </h2>

                    <p>
                        Explore our collection and find
                        something you'll love.
                    </p>

                </div>

                <Link
                    to="/products"
                    className="cta-button"
                >
                    Browse Products →
                </Link>

            </section>

        </div>
    );
}

export default Home;