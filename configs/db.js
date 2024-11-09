const mongoose = require("mongoose");

// Configuration options
const MONGO_OPTIONS = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    retryWrites: true
};

// Connection URL should come from environment variables
const getMongoURI = () => {
    const username = process.env.MONGO_USER || 'shihabshaikh96';
    const password = process.env.MONGO_PASSWORD || 'dream';
    const cluster = process.env.MONGO_CLUSTER || 'cluster0.4joqh';
    const dbName = process.env.MONGO_DB_NAME || 'your_database_name';
    
    return `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}`;
};

// Monitor mongoose connection events
const handleMongooseConnection = () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });
};

const connect = async () => {
    try {
        // Set up connection event handlers
        handleMongooseConnection();

        // Connect to MongoDB
        await mongoose.connect(getMongoURI(), MONGO_OPTIONS);
        
        return mongoose.connection;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // Retry logic could be implemented here
        throw error;
    }
};

// Graceful disconnection
const disconnect = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
};

module.exports = {
    connect,
    disconnect,
    getMongoURI
};