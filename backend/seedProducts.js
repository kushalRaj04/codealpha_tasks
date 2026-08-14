const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [

 
    {
        name: "Classic Black T-Shirt",
        description: "Comfortable regular-fit cotton t-shirt for everyday wear.",
        price: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        category: "Men",
        stock: 50
    },

    {
        name: "Premium White T-Shirt",
        description: "Soft premium cotton t-shirt with a clean minimalist design.",
        price: 699,
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=800",
        category: "Men",
        stock: 45
    },

    {
        name: "Casual Denim Shirt",
        description: "Classic blue denim shirt suitable for casual occasions.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
        category: "Men",
        stock: 30
    },

    {
        name: "Slim Fit Jeans",
        description: "Modern slim-fit denim jeans with a comfortable stretch.",
        price: 1599,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        category: "Men",
        stock: 35
    },

    {
        name: "Casual Jacket",
        description: "Stylish lightweight jacket perfect for casual outfits.",
        price: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        category: "Men",
        stock: 20
    },

    {
        name: "Oversized Hoodie",
        description: "Soft oversized hoodie designed for comfortable casual wear.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        category: "Men",
        stock: 35
    },


 
    {
        name: "Women's Summer Dress",
        description: "Elegant lightweight dress designed for comfortable summer wear.",
        price: 1499,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
        category: "Women",
        stock: 25
    },

    {
        name: "Women's Casual Top",
        description: "Comfortable casual top with a modern everyday style.",
        price: 799,
        image: "https://images.unsplash.com/photo-1564257577054-3e7a1f4b3f2f?w=800",
        category: "Women",
        stock: 40
    },

    {
        name: "Women's Denim Jacket",
        description: "Classic denim jacket that pairs well with casual outfits.",
        price: 1799,
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800",
        category: "Women",
        stock: 22
    },

    {
        name: "Women's Casual Jeans",
        description: "Comfortable everyday jeans with a contemporary fit.",
        price: 1399,
        image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800",
        category: "Women",
        stock: 32
    },

    {
        name: "Women's Knit Sweater",
        description: "Comfortable knit sweater with a simple modern design.",
        price: 1199,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
        category: "Women",
        stock: 25
    },


 
    {
        name: "Running Sneakers",
        description: "Lightweight sneakers designed for walking and everyday activities.",
        price: 2299,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "Shoes",
        stock: 28
    },

    {
        name: "Classic White Sneakers",
        description: "Minimal white sneakers that complement casual outfits.",
        price: 1999,
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800",
        category: "Shoes",
        stock: 35
    },

    {
        name: "Sports Sneakers",
        description: "Comfortable sports shoes with a lightweight sole.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
        category: "Shoes",
        stock: 24
    },

    {
        name: "Canvas Shoes",
        description: "Lightweight canvas shoes for casual everyday outfits.",
        price: 999,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
        category: "Shoes",
        stock: 45
    },


 
    {
        name: "Leather Handbag",
        description: "Elegant everyday handbag with a spacious interior.",
        price: 1799,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        category: "Accessories",
        stock: 18
    },

    {
        name: "Classic Backpack",
        description: "Spacious backpack suitable for college, work and travel.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        category: "Accessories",
        stock: 30
    },

    {
        name: "Leather Watch",
        description: "Classic-style watch with a comfortable leather strap.",
        price: 1599,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
        category: "Accessories",
        stock: 15
    },

    {
        name: "Sunglasses",
        description: "Classic sunglasses with a stylish frame for everyday use.",
        price: 899,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
        category: "Accessories",
        stock: 40
    },

    {
        name: "Travel Duffel Bag",
        description: "Spacious duffel bag suitable for short trips and travel.",
        price: 1499,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        category: "Accessories",
        stock: 20
    }

];


 
const seedProducts = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URL
        );

        console.log("MongoDB connected");


        // Delete existing products

        await Product.deleteMany();

        console.log(
            "Old products deleted"
        );


        // Insert new products

        await Product.insertMany(
            products
        );

        console.log(
            `${products.length} products inserted successfully`
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "SEED ERROR:",
            error
        );

        process.exit(1);

    }

};


seedProducts();