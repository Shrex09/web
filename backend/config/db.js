const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Database connection function
const connectDB = async () => {
    try {
        const dbURI = process.env.ATLAS_URL;  // Fetch the MongoDB URI from the environment

        if (!dbURI) {
            throw new Error('MongoDB URI is not defined in the environment variables');
        }

        // Connecting to MongoDB Atlas using the URI
        const conn = await mongoose.connect(dbURI, {
            useNewUrlParser: true,  // Avoid deprecation warnings
            useUnifiedTopology: true,  // Ensure new server monitoring engine
            serverSelectionTimeoutMS: 30000,  // Timeout in milliseconds (30 seconds)
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit the process on connection failure
    }
};

module.exports = connectDB;
