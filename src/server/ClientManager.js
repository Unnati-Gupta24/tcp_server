const Logger = require('../utils/Logger');
const { TIMEOUTS } = require('../utils/Constants');

class ClientManager {
    constructor() {
        this.clients = new Map(); 
        this.usernames = new Map(); 
        this.logger = new Logger();
    }

    registerClient(socket, username) {
        this.clients.set(socket, {
            username,
            lastActivity: Date.now()
        });
        this.usernames.set(username, socket);
    }

    isUsernameTaken(username) {
        return this.usernames.has(username);
    }

    updateActivity(socket) {
        const client = this.clients.get(socket);
        if (client) {
            client.lastActivity = Date.now();
        }
    }

    getUsername(socket) {
        const client = this.clients.get(socket);
        return client ? client.username : null;
    }

    getSocket(username) {
        return this.usernames.get(username);
    }

    getAllUsernames() {
        return Array.from(this.usernames.keys());
    }

    sendMessage(socket, message) {
        try {
            if (!socket.destroyed) {
                socket.write(message);
            }
        } catch (err) {
            this.logger.error(`Error sending message: ${err.message}`);
        }
    }

    broadcast(message, excludeSocket = null) {
        const deadSockets = [];

        for (const [socket, info] of this.clients.entries()) {
            if (socket !== excludeSocket) {
                try {
                    if (!socket.destroyed) {
                        socket.write(message);
                    } else {
                        deadSockets.push(socket);
                    }
                } catch (err) {
                    this.logger.error(`Error broadcasting: ${err.message}`);
                    deadSockets.push(socket);
                }
            }
        }

        for (const socket of deadSockets) {
            const info = this.clients.get(socket);
            if (info) {
                this.disconnectClient(socket, info.username);
            }
        }
    }

    disconnectClient(socket, username) {
        if (this.clients.has(socket)) {
            this.clients.delete(socket);
        }

        if (username && this.usernames.has(username)) {
            this.usernames.delete(username);
            this.logger.info(`${username} disconnected`);
            this.broadcast(`INFO ${username} disconnected\n`);
        }

        try {
            if (!socket.destroyed) {
                socket.destroy();
            }
        } catch (err) {
        }
    }

    disconnectAll() {
        for (const [socket, info] of this.clients.entries()) {
            this.sendMessage(socket, 'INFO server-shutdown\n');
            this.disconnectClient(socket, info.username);
        }
    }

    startIdleChecker() {
        setInterval(() => {
            const now = Date.now();
            const deadSockets = [];

            for (const [socket, info] of this.clients.entries()) {
                if (now - info.lastActivity > TIMEOUTS.IDLE) {
                    deadSockets.push({ socket, username: info.username });
                }
            }

            for (const { socket, username } of deadSockets) {
                this.logger.info(`Disconnecting idle user: ${username}`);
                this.sendMessage(socket, 'INFO timeout-idle\n');
                this.disconnectClient(socket, username);
            }
        }, TIMEOUTS.CHECK_INTERVAL);
    }
}

module.exports = ClientManager;