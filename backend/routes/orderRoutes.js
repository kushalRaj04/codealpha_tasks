const express = require("express");

const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getAdminStats
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// USER ROUTES

// USER ROUTES

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);

router.get(
    "/:id",
    protect,
    getOrderById
);


// ADMIN ROUTES

router.get(
    "/admin/stats",
    protect,
    admin,
    getAdminStats
);

router.get(
    "/admin/all",
    protect,
    admin,
    getAllOrders
);

router.put(
    "/admin/:id",
    protect,
    admin,
    updateOrderStatus
);


module.exports = router;