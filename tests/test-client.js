const net = require('net');

class TestClient {
    constructor(username, port = 4000, host = 'localhost') {
        this.username = username;
        this.port = port;
        this.host = host;
        this.socket = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = net.createConnection(this.port, this.host, () => {
                console.log(`[${this.username}] Connected to server`);
                resolve();
            });

            this.socket.on('data', (data) => {
                console.log(`[${this.username}] Received: ${data.toString().trim()}`);
            });

            this.socket.on('error', (err) => {
                console.error(`[${this.username}] Error: ${err.message}`);
                reject(err);
            });

            this.socket.on('close', () => {
                console.log(`[${this.username}] Disconnected`);
            });
        });
    }

    send(message) {
        return new Promise((resolve) => {
            this.socket.write(message + '\n', () => {
                console.log(`[${this.username}] Sent: ${message}`);
                resolve();
            });
        });
    }

    async login() {
        await this.send(`LOGIN ${this.username}`);
        await this.sleep(500);
    }

    async sendMessage(text) {
        await this.send(`MSG ${text}`);
        await this.sleep(500);
    }

    async sendDM(target, text) {
        await this.send(`DM ${target} ${text}`);
        await this.sleep(500);
    }

    async who() {
        await this.send('WHO');
        await this.sleep(500);
    }

    async ping() {
        await this.send('PING');
        await this.sleep(500);
    }

    disconnect() {
        this.socket.end();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

async function runTest() {
    console.log('Starting test...\n');

    const client1 = new TestClient('Alice');
    const client2 = new TestClient('Bob');

    try {
        // Connect both clients
        await client1.connect();
        await client2.connect();

        // Login
        await client1.login();
        await client2.login();

        // Send messages
        await client1.sendMessage('Hello everyone!');
        await client2.sendMessage('Hi Alice!');

        // WHO command
        await client1.who();

        // Direct message
        await client1.sendDM('Bob', 'How are you?');

        // Ping
        await client1.ping();

        // Wait and disconnect
        await client1.sleep(2000);
        client1.disconnect();
        client2.disconnect();

        console.log('\nTest completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

if (require.main === module) {
    runTest();
}

module.exports = TestClient;