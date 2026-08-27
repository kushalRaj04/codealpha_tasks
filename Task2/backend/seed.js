const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");

const usersData = [
    {
        username: "arjun_dev",
        email: "arjun@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=12",
        bio: "Full Stack Developer 🚀 | MERN Stack | Building cool things"
    },
    {
        username: "priya_codes",
        email: "priya@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=47",
        bio: "JavaScript enthusiast 💻 | Learning something new every day"
    },
    {
        username: "rahul_creates",
        email: "rahul@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=33",
        bio: "Designer 🎨 | Creator | Turning ideas into reality"
    },
    {
        username: "sneha_ai",
        email: "sneha@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=44",
        bio: "AI & ML enthusiast 🤖 | Exploring the future of technology"
    },
    {
        username: "vikram_travels",
        email: "vikram@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=11",
        bio: "Travel • Photography 📸 | Collecting memories, not things"
    },
    {
        username: "meera_reads",
        email: "meera@example.com",
        password: "password123",
        profilePicture: "https://i.pravatar.cc/150?img=32",
        bio: "Books 📚 | Coffee ☕ | Quiet mornings"
    }
];


const postsData = [
    {
        username: "arjun_dev",
        content: "Just finished building my first MERN project! 🚀 It feels amazing to see an idea turn into a working application.",
        image: "https://picsum.photos/800/500?random=1"
    },
    {
        username: "priya_codes",
        content: "Learning something new every day. Today I finally understood how asynchronous JavaScript really works! 💻✨",
        image: "https://picsum.photos/800/500?random=2"
    },
    {
        username: "rahul_creates",
        content: "Sometimes the simplest designs are the best ones. 🎨 Keep creating and keep experimenting.",
        image: "https://picsum.photos/800/500?random=3"
    },
    {
        username: "sneha_ai",
        content: "Exploring the possibilities of Artificial Intelligence and Machine Learning. The future is exciting! 🤖",
        image: "https://picsum.photos/800/500?random=4"
    },
    {
        username: "vikram_travels",
        content: "Another beautiful place, another unforgettable memory. 📸 Travel reminds us how big the world really is.",
        image: "https://picsum.photos/800/500?random=5"
    },
    {
        username: "meera_reads",
        content: "Nothing beats a good book, a cup of coffee and a peaceful evening. 📚☕",
        image: "https://picsum.photos/800/500?random=6"
    },
    {
        username: "arjun_dev",
        content: "Consistency is more important than motivation. Keep showing up and keep building. 💪",
        image: "https://picsum.photos/800/500?random=7"
    },
    {
        username: "priya_codes",
        content: "Working on a new project today. Debugging can be frustrating, but solving the problem is always worth it! 🔥",
        image: "https://picsum.photos/800/500?random=8"
    }
];


async function seedDatabase() {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Clear existing sample data
        await User.deleteMany({
            email: {
                $in: usersData.map(user => user.email)
            }
        });

        console.log("Old sample users removed");

        // Create users with hashed passwords
        const createdUsers = [];

        for (const userData of usersData) {

            const hashedPassword = await bcrypt.hash(
                userData.password,
                10
            );

            const user = await User.create({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                profilePicture: userData.profilePicture,
                bio: userData.bio
            });

            createdUsers.push(user);
        }

        console.log(`${createdUsers.length} users created`);

        // Create posts
        const posts = [];

        for (const postData of postsData) {

            const author = createdUsers.find(
                user => user.username === postData.username
            );

            posts.push({
                author: author._id,
                content: postData.content,
                image: postData.image
            });
        }

        await Post.insertMany(posts);

        console.log(`${posts.length} posts created`);

        console.log("=================================");
        console.log("Database seeded successfully!");
        console.log("=================================");

        process.exit(0);

    } catch (error) {

        console.error("Seed error:", error);

        process.exit(1);
    }
}


seedDatabase();