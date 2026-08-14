import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const limit = 12;


 
    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                const params = {
                    page,
                    limit
                };


                if (search.trim()) {
                    params.search = search.trim();
                }


                if (category !== "all") {
                    params.category = category;
                }


                if (minPrice !== "") {
                    params.minPrice = minPrice;
                }


                if (maxPrice !== "") {
                    params.maxPrice = maxPrice;
                }


                if (sort) {
                    params.sort = sort;
                }


                const response = await api.get(
                    "/products",
                    {
                        params
                    }
                );


                setProducts(
                    response.data.products || []
                );


                setTotalPages(
                    response.data.totalPages || 1
                );


                setTotalProducts(
                    response.data.totalProducts || 0
                );


                setError("");

            } catch (error) {

                console.error(
                    "PRODUCT FETCH ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, [
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page
    ]);


 
    const handleSearchChange = (e) => {

        setSearch(e.target.value);
        setPage(1);

    };


    const handleCategoryChange = (e) => {

        setCategory(e.target.value);
        setPage(1);

    };


    const handleMinPriceChange = (e) => {

        setMinPrice(e.target.value);
        setPage(1);

    };


    const handleMaxPriceChange = (e) => {

        setMaxPrice(e.target.value);
        setPage(1);

    };


    const handleSortChange = (e) => {

        setSort(e.target.value);
        setPage(1);

    };


 
    const clearFilters = () => {

        setSearch("");
        setCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setPage(1);

    };


    return (

        <div className="products-page">


            {/* HEADER */}

            <div className="products-header">

                <div>

                    <h1>
                        Our Products
                    </h1>

                    <p>
                        Discover products you'll love
                    </p>

                </div>

            </div>


            {/* FILTER CONTROLS */}

            <div className="products-controls">


                {/* Search */}

                <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={search}
                    onChange={handleSearchChange}
                />


                {/* Category */}

                <select
                    value={category}
                    onChange={handleCategoryChange}
                >

                    <option value="all">
                        All Categories
                    </option>

                    <option value="Men">
    Men
</option>

<option value="Women">
    Women
</option>

<option value="Shoes">
    Shoes
</option>

<option value="Accessories">
    Accessories
</option>

                </select>


                {/* Minimum Price */}

                <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    min="0"
                />


                {/* Maximum Price */}

                <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    min="0"
                />


                {/* Sort */}

                <select
                    value={sort}
                    onChange={handleSortChange}
                >

                    <option value="">
                        Sort By
                    </option>

                    <option value="price-low">
                        Price: Low to High
                    </option>

                    <option value="price-high">
                        Price: High to Low
                    </option>

                    <option value="name-az">
                        Name: A-Z
                    </option>

                    <option value="name-za">
                        Name: Z-A
                    </option>

                </select>


                {/* Clear */}

                <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>

            </div>


            {/* RESULT COUNT */}

            {!loading && !error && (

                <div className="products-result-count">

                    Showing {products.length} of{" "}
                    {totalProducts} products

                </div>

            )}


            {/* LOADING */}

            {loading && (

                <div className="products-message">

                    <h2>
                        Loading products...
                    </h2>

                </div>

            )}


            {/* ERROR */}

            {!loading && error && (

                <div className="products-message error">

                    <h2>
                        {error}
                    </h2>

                </div>

            )}


            {/* NO PRODUCTS */}

            {!loading &&
                !error &&
                products.length === 0 && (

                    <div className="products-message">

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try changing your filters.
                        </p>

                        <button
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                )
            }


            {/* PRODUCTS */}

            {!loading &&
                !error &&
                products.length > 0 && (

                    <div className="products-container">

                        {products.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                )
            }


            {/* PAGINATION */}

            {!loading &&
                !error &&
                totalPages > 1 && (

                    <div className="pagination">

                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >
                            ← Previous
                        </button>


                        <span>
                            Page {page} of {totalPages}
                        </span>


                        <button
                            disabled={page === totalPages}
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >
                            Next →
                        </button>

                    </div>

                )
            }

        </div>
    );
}


export default Products;