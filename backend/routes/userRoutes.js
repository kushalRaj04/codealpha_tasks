const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/admin", protect, admin, getAllUsers);

router.delete("/admin/:id", protect, admin, deleteUser);

module.exports = router;