const Logger = require('../utils/Logger');
const { COMMANDS, ERRORS } = require('../utils/Constants');

class CommandHandler {
    constructor(clientManager) {
        this.clientManager = clientManager;
        this.logger = new Logger();
    }

    processCommand(socket, username, command) {
        if (command.startsWith(COMMANDS.MSG)) {
            this.handleMessage(socket, username, command);
        } else if (command === COMMANDS.WHO) {
            this.handleWho(socket);
        } else if (command.startsWith(COMMANDS.DM)) {
            this.handleDirectMessage(socket, username, command);
        } else if (command === COMMANDS.PING) {
            this.handlePing(socket);
        } else {
            this.clientManager.sendMessage(socket, `${ERRORS.UNKNOWN_COMMAND}\n`);
        }
    }

    handleMessage(socket, username, command) {
        const message = command.substring(COMMANDS.MSG.length).trim();
        
        if (!message) {
            return;
        }

        const broadcastMsg = `MSG ${username} ${message}\n`;
        this.clientManager.broadcast(broadcastMsg, socket);
        this.logger.chat(`${username}: ${message}`);
    }

    handleWho(socket) {
        const usernames = this.clientManager.getAllUsernames();
        
        for (const username of usernames) {
            this.clientManager.sendMessage(socket, `USER ${username}\n`);
        }
    }

    handleDirectMessage(socket, username, command) {
        const parts = command.substring(COMMANDS.DM.length).split(' ');
        
        if (parts.length < 2) {
            this.clientManager.sendMessage(socket, `${ERRORS.INVALID_DM_FORMAT}\n`);
            return;
        }

        const targetUsername = parts[0];
        const message = parts.slice(1).join(' ').trim();

        if (!message) {
            this.clientManager.sendMessage(socket, `${ERRORS.INVALID_DM_FORMAT}\n`);
            return;
        }

        const targetSocket = this.clientManager.getSocket(targetUsername);

        if (!targetSocket) {
            this.clientManager.sendMessage(socket, `${ERRORS.USER_NOT_FOUND}\n`);
            return;
        }

        const dmMsg = `DM ${username} ${message}\n`;
        this.clientManager.sendMessage(targetSocket, dmMsg);
        this.clientManager.sendMessage(socket, `DM-SENT ${targetUsername}\n`);
        this.logger.dm(`${username} -> ${targetUsername}: ${message}`);
    }

    handlePing(socket) {
        this.clientManager.sendMessage(socket, 'PONG\n');
    }
}

module.exports = CommandHandler;