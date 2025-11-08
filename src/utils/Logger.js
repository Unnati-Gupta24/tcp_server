class Logger {
    constructor() {
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            cyan: '\x1b[36m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            red: '\x1b[31m',
            magenta: '\x1b[35m'
        };
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    info(message) {
        console.log(`${this.colors.cyan}[SERVER]${this.colors.reset} ${message}`);
    }

    error(message) {
        console.error(`${this.colors.red}[ERROR]${this.colors.reset} ${message}`);
    }

    chat(message) {
        console.log(`${this.colors.green}[CHAT]${this.colors.reset} ${message}`);
    }

    dm(message) {
        console.log(`${this.colors.magenta}[DM]${this.colors.reset} ${message}`);
    }

    warn(message) {
        console.log(`${this.colors.yellow}[WARN]${this.colors.reset} ${message}`);
    }
}

module.exports = Logger;