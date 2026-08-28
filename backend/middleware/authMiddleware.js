const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check token
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // IMPORTANT
        // Your JWT has "id", not "_id"
        req.user = {
            _id: decoded.id,
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {

        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;