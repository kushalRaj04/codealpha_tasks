const Cart = require("../models/Cart");
const Product = require("../models/Product");

 const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        // Cart doesn't exist
        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: {
                    items: []
                }
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        console.error("GET CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        // Check product ID
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Quantity
        const addQuantity = Number(quantity) || 1;

        if (!Number.isInteger(addQuantity) || addQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({
            user: req.user._id
        });


         if (!cart) {

            cart = await Cart.create({
                user: req.user._id,

                items: [
                    {
                        product: productId,
                        quantity: addQuantity
                    }
                ]
            });

            // Populate product
            await cart.populate("items.product");

            return res.status(201).json({
                success: true,
                message: "Product added to cart",
                cart
            });
        }


         const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId
        );


        if (existingItem) {

            existingItem.quantity += addQuantity;

        } else {

            cart.items.push({
                product: productId,
                quantity: addQuantity
            });
        }


        // Save cart
        await cart.save();

        // Populate product
        await cart.populate("items.product");


        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        console.error("ADD TO CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const updateCartQuantity = async (req, res) => {
    try {

        const { productId } = req.params;
        const { quantity } = req.body;

        console.log("UPDATE CART");
        console.log("USER ID:", req.user._id);
        console.log("PRODUCT ID:", productId);
        console.log("QUANTITY:", quantity);


        // Convert quantity to number
        const newQuantity = Number(quantity);


        // Validate quantity
        if (
            !Number.isInteger(newQuantity) ||
            newQuantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }


        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }


        // Find product inside cart
        const item = cart.items.find(
            item =>
                item.product.toString() === productId
        );


        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }


        // Update quantity
        item.quantity = newQuantity;


        // Save cart
        await cart.save();


        // Populate products
        await cart.populate("items.product");


        res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {

        console.error(
            "UPDATE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;


        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }


        // Check whether product exists
        const itemExists = cart.items.some(
            item =>
                item.product.toString() === productId
        );


        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }


        // Remove product
        cart.items = cart.items.filter(
            item =>
                item.product.toString() !== productId
        );


        // Save
        await cart.save();


        // Populate
        await cart.populate("items.product");


        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user._id
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }


        // Remove all items
        cart.items = [];


        // Save
        await cart.save();


        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {

        console.error(
            "CLEAR CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 module.exports = {
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};