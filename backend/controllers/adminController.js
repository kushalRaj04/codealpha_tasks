const User = require("../models/User");
const Product = require("../models/product");
const Order = require("../models/order");

const getDashboardStats = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments({
            status: { $ne: "Cancelled" }
        });

        const revenueResult = await Order.aggregate([
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

        res.status(200).json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardStats
};