const mongoose = require("mongoose");




const connectDB = async () => {
    try {
        console.log("Mongo URL:", process.env.MONGO_URL);

        await mongoose.connect(process.env.MONGO_URL);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log("❌ Database Connection Failed");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;