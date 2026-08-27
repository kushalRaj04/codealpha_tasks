const express = require("express");

const Comment = require("../models/Comments");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create comment
router.post("/:postId", authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = new Comment({
            post: req.params.postId,
            author: req.userId,
            content: content.trim()
        });

        await comment.save();

        await comment.populate(
            "author",
            "username profilePicture"
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Get comments for a post
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            comments
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Delete comment
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only comment author can delete it
        if (comment.author.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own comment"
            });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;