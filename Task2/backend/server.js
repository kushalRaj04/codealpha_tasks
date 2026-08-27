const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();


 
app.use(cors());

app.use(express.json());


 
app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);


 
app.get("/", (req, res) => {

    res.send("ConnectHub API is running successfully 🚀");

});


 
const PORT = process.env.PORT || 5000;


 
mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );


        app.listen(PORT, () => {

            console.log(
                `Server is running on port ${PORT}`
            );

        });

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });