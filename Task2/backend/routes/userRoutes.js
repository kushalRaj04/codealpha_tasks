const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to database
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Login successful
        const token = jwt.sign(
    {
        userId: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.status(200).json({
    message: "Login successful",
    token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio
    }
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { username, bio, profilePicture } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (username) {
            user.username = username;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});




router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



router.post("/:id/follow", authMiddleware, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found"
            });
        }

        // User cannot follow themselves
        if (req.userId.toString() === req.params.id) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        // Check if already following
        if (currentUser.following.includes(userToFollow._id)) {
           const alreadyFollowing =
    currentUser.following.some(
        userId =>
            userId.toString() ===
            userToFollow._id.toString()
    );

if (alreadyFollowing) {
    return res.status(400).json({
        message: "You are already following this user"
    });
}
        }

        // Add target user to current user's following
        currentUser.following.push(userToFollow._id);

        // Add current user to target user's followers
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: "User followed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



router.delete("/:id/follow", authMiddleware, async (req, res) => {
    try {
        const userToUnfollow =
            await User.findById(req.params.id);

        const currentUser =
            await User.findById(req.userId);

        if (!userToUnfollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found"
            });
        }

        // Remove target user from current user's following
        currentUser.following =
            currentUser.following.filter(
                userId =>
                    userId.toString() !==
                    userToUnfollow._id.toString()
            );

        
        userToUnfollow.followers =
            userToUnfollow.followers.filter(
                userId =>
                    userId.toString() !==
                    currentUser._id.toString()
            );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



router.get("/:id/followers", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("followers")
            .populate("followers", "username profilePicture bio");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            followers: user.followers
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get("/:id/following", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("following")
            .populate("following", "username profilePicture bio");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            following: user.following
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;