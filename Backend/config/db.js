const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    // console.log("MONGO_URI from .env:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in .env file!");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
