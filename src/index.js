const ChatServer = require('./server/ChatServer');
const config = require('../config/config');
const Logger = require('./utils/Logger');

const logger = new Logger();

const port = parseInt(process.argv[2] || config.PORT);
const host = process.env.CHAT_HOST || config.HOST;

if (isNaN(port) || port < 1 || port > 65535) {
    logger.error('Invalid port number. Must be between 1 and 65535');
    process.exit(1);
}

const server = new ChatServer(host, port);

try {
    server.start();
} catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
}

const shutdown = (signal) => {
    logger.info(`\nReceived ${signal}. Shutting down gracefully...`);
    server.stop();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));