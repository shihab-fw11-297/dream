const app = require('./app');
const config = require('./config');
const { connect, disconnect } = require('./configs/db');

const server = app.listen(config.PORT, async () => {
    // Connect to MongoDB
    await connect();
    console.log(`Forex Analysis Server running on port ${config.PORT}`);
    console.log(`Server time: ${new Date().toISOString()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async() => {
        // When shutting down your application
        await disconnect();
        console.log('HTTP server closed');
        process.exit(0);
    });
});
