const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/User");

 const createOrder = async (req, res) => {
    try {
        const {
            fullName,
            address,
            city,
            phone
        } = req.body;

        if (!fullName || !address || !city || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please fill all shipping details"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {

            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart no longer exists"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} does not have enough stock`
                });
            }

            const itemTotal =
                product.price * item.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            user: req.user._id,

            items: orderItems,

            shippingAddress: {
                fullName,
                address,
                city,
                phone
            },

            totalAmount
        });

        // Reduce stock
        for (const item of cart.items) {

            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // Clear cart
        cart.items = [];

        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error(
            "CREATE ORDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {

        console.log("CURRENT USER ID:", req.user._id);

        const orders = await Order.find({
            user: req.user._id
        })
            .populate("items.product")
            .sort({
                createdAt: -1
            });

        console.log(
            "ORDERS FOUND:",
            orders.map(order => ({
                orderId: order._id,
                orderUser: order.user
            }))
        );

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error(
            "GET MY ORDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

 const getOrderById = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error(
            "GET ORDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const cancelOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.status !== "Pending" &&
            order.status !== "Processing"
        ) {
            return res.status(400).json({
                success: false,
                message: "This order cannot be cancelled"
            });
        }

        order.status = "Cancelled";

        await order.save();

        // Restore stock
        for (const item of order.items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {

        console.error(
            "CANCEL ORDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const updateOrderStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


 const getAdminStats = async (req, res) => {
    try {

        // Total products
        const totalProducts =
            await Product.countDocuments();


        // Total users
        const totalUsers =
            await User.countDocuments();


        // Total orders
        const totalOrders =
            await Order.countDocuments();


        // Pending orders
        const pendingOrders =
            await Order.countDocuments({
                status: "Pending"
            });


        // Total revenue
        const revenueResult =
            await Order.aggregate([
                {
                    $match: {
                        status: {
                            $ne: "Cancelled"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,

                        totalRevenue: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        // Send statistics
        res.status(200).json({

            success: true,

            stats: {

                totalProducts,

                totalUsers,

                totalOrders,

                pendingOrders,

                totalRevenue

            }

        });

    } catch (error) {

        console.error(
            "ADMIN STATS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


 module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    cancelOrder,

    getAllOrders,

    updateOrderStatus,

    getAdminStats

};