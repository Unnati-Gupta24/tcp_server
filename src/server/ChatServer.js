const net = require('net');
const ClientManager = require('./ClientManager');
const CommandHandler = require('./CommandHandler');
const Logger = require('../utils/Logger');
const { TIMEOUTS } = require('../utils/Constants');

class ChatServer {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.server = null;
        this.clientManager = new ClientManager();
        this.commandHandler = new CommandHandler(this.clientManager);
        this.logger = new Logger();
    }

    start() {
        this.server = net.createServer((socket) => {
            this.handleNewConnection(socket);
        });

        this.server.listen(this.port, this.host, () => {
            this.logger.info(`Chat server started on ${this.host}:${this.port}`);
            this.logger.info('Waiting for connections...');
        });

        this.server.on('error', (err) => {
            this.logger.error(`Server error: ${err.message}`);
            throw err;
        });

        this.clientManager.startIdleChecker();
    }

    handleNewConnection(socket) {
        const address = `${socket.remoteAddress}:${socket.remotePort}`;
        this.logger.info(`New connection from ${address}`);

        const connectionState = {
            socket,
            address,
            username: null,
            buffer: '',
            loggedIn: false
        };

        const loginTimeout = setTimeout(() => {
            if (!connectionState.loggedIn) {
                this.clientManager.sendMessage(socket, 'ERR login-timeout\n');
                socket.destroy();
            }
        }, TIMEOUTS.LOGIN);

        socket.on('data', (data) => {
            this.handleData(connectionState, data, loginTimeout);
        });

        socket.on('close', () => {
            clearTimeout(loginTimeout);
            this.clientManager.disconnectClient(socket, connectionState.username);
        });

        socket.on('end', () => {
            clearTimeout(loginTimeout);
            this.clientManager.disconnectClient(socket, connectionState.username);
        });

        socket.on('error', (err) => {
            this.logger.error(`Socket error for ${connectionState.username || address}: ${err.message}`);
        });
    }

    handleData(state, data, loginTimeout) {
        state.buffer += data.toString('utf-8');

        let newlineIndex;
        while ((newlineIndex = state.buffer.indexOf('\n')) !== -1) {
            const line = state.buffer.substring(0, newlineIndex).trim();
            state.buffer = state.buffer.substring(newlineIndex + 1);

            if (!line) continue;

            if (!state.loggedIn) {
                this.handleLogin(state, line, loginTimeout);
            } else {
                
                this.clientManager.updateActivity(state.socket);
                this.commandHandler.processCommand(state.socket, state.username, line);
            }
        }
    }

    handleLogin(state, line, loginTimeout) {
        if (!line.startsWith('LOGIN ')) {
            this.clientManager.sendMessage(state.socket, 'ERR must-login-first\n');
            return;
        }

        const username = line.substring(6).trim();

        if (!username || username.includes(' ') || username.length > 20) {
            this.clientManager.sendMessage(state.socket, 'ERR invalid-username\n');
            return;
        }

        if (this.clientManager.isUsernameTaken(username)) {
            this.clientManager.sendMessage(state.socket, 'ERR username-taken\n');
            return;
        }

        this.clientManager.registerClient(state.socket, username);
        this.clientManager.sendMessage(state.socket, 'OK\n');
        this.logger.chat(`${username} logged in from ${state.address}`);

        state.username = username;
        state.loggedIn = true;
        clearTimeout(loginTimeout);

        this.clientManager.broadcast(`INFO ${username} joined\n`, state.socket);
    }

    stop() {
        if (this.server) {
            this.clientManager.disconnectAll();
            this.server.close(() => {
                this.logger.info('Server stopped');
            });
        }
    }
}

module.exports = ChatServer;