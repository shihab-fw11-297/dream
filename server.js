const app = require('./app');
const config = require('./config');

const server = app.listen(config.PORT, () => {
    console.log(`Forex Analysis Server running on port ${config.PORT}`);
    console.log(`Server time: ${new Date().toISOString()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
