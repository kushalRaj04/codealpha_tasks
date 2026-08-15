const Product = require("../models/product");

 const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        // Check required fields
        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getProducts = async (req, res) => {
    try {

        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort
        } = req.query;


 
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;

        const skip = (page - 1) * limit;


 
        const filter = {};


        // Search
        if (search && search.trim() !== "") {

            filter.name = {
                $regex: search.trim(),
                $options: "i"
            };

        }


        // Category
        if (
            category &&
            category !== "all" &&
            category.trim() !== ""
        ) {

            filter.category = {
    $regex: `^${category.trim()}$`,
    $options: "i"
};

        }


        // Minimum price
        if (
            minPrice !== undefined &&
            minPrice !== ""
        ) {

            filter.price = {
                $gte: Number(minPrice)
            };

        }


        // Maximum price
        if (
            maxPrice !== undefined &&
            maxPrice !== ""
        ) {

            if (filter.price) {

                filter.price.$lte = Number(maxPrice);

            } else {

                filter.price = {
                    $lte: Number(maxPrice)
                };

            }

        }


 
        let sortOption = {
            createdAt: -1
        };


        if (sort === "price-low") {

            sortOption = {
                price: 1
            };

        }

        else if (sort === "price-high") {

            sortOption = {
                price: -1
            };

        }

        else if (sort === "name-az") {

            sortOption = {
                name: 1
            };

        }

        else if (sort === "name-za") {

            sortOption = {
                name: -1
            };

        }


 
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

            console.log("QUERY:", req.query);
console.log("FILTER:", filter);


 
        const totalProducts =
            await Product.countDocuments(filter);


        const totalPages =
            Math.ceil(totalProducts / limit);


        res.status(200).json({

            success: true,

            page,

            limit,

            totalProducts,

            totalPages,

            products

        });


    } catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

 const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};