const express = require("express");

const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");


 router.get(
    "/",
    protect,
    getCart
);


 router.post(
    "/add",
    protect,
    addToCart
);


 router.patch(
    "/update/:productId",
    protect,
    updateCartQuantity
);


 router.delete(
    "/remove/:productId",
    protect,
    removeFromCart
);


 router.delete(
    "/clear",
    protect,
    clearCart
);


module.exports = router;