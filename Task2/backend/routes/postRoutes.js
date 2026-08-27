const express = require("express");

const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Post content is required"
            });
        }

        const post = new Post({
            author: req.userId,
            content,
            image: image || ""
        });

        await post.save();

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/user/:userId", async (req, res) => {

    try {

        console.log("=================================");
        console.log("GET USER POSTS");
        console.log("User ID:", req.params.userId);
        console.log("=================================");

        const posts = await Post.find({
            author: req.params.userId
        })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 });

        console.log("Posts found:", posts.length);

        res.status(200).json({
            posts: posts
        });

    } catch (error) {

        console.error("=================================");
        console.error("GET USER POSTS ERROR");
        console.error(error);
        console.error("=================================");

        res.status(500).json({
            message: "Unable to load user posts",
            error: error.message
        });

    }

});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            posts
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

        const post =
            await Post.findById(
                req.params.id
            )
            .populate(
                "author",
                "username profilePicture"
            )
            .populate(
                "comments.user",
                "username profilePicture"
            );


        if (!post) {

            return res.status(404).json({

                message:
                    "Post not found"

            });

        }


        res.status(200).json({

            post

        });


    } catch (error) {

        console.error(
            "Get single post error:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});



router.post("/:id/like", authMiddleware, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        const userId = req.userId.toString();


        

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );


 
        if (alreadyLiked) {

            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );

            await post.save();

            return res.status(200).json({

                message: "Post unliked successfully",

                liked: false,

                likesCount: post.likes.length

            });

        }


 
        post.likes.push(req.userId);

        await post.save();


        res.status(200).json({

            message: "Post liked successfully",

            liked: true,

            likesCount: post.likes.length

        });


    } catch (error) {

        console.error("Like/unlike error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

});



router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Only the author can delete the post
        if (post.author.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


 
router.post(
    "/:id/comments",
    authMiddleware,
    async (req, res) => {

        try {

            const { text } = req.body;


 
            if (!text || !text.trim()) {

                return res.status(400).json({

                    message:
                        "Comment cannot be empty"

                });

            }


 
            const post =
                await Post.findById(
                    req.params.id
                );


            if (!post) {

                return res.status(404).json({

                    message:
                        "Post not found"

                });

            }


 
            post.comments.push({

                user: req.userId,

                text: text.trim()

            });


            await post.save();


 
            const updatedPost =
                await Post.findById(
                    post._id
                )
                .populate(
                    "author",
                    "username profilePicture"
                )
                .populate(
                    "comments.user",
                    "username profilePicture"
                );


            res.status(201).json({

                message:
                    "Comment added successfully",

                post: updatedPost

            });


        } catch (error) {

            console.error(
                "Add comment error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);



module.exports = router;