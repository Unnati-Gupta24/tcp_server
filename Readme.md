# 💬 TCP Chat Server

A real-time TCP chat server built with Node.js using only the standard library. Supports multiple users, private messaging, and automatic idle timeout.

---

## ✨ Features

- ✅ Multiple concurrent connections (10+ users)
- ✅ Username-based login system
- ✅ Real-time message broadcasting
- ✅ Disconnect notifications
- 🎁 **WHO** - List active users
- 🎁 **DM** - Private messaging
- 🎁 **PING/PONG** - Heartbeat check
- 🎁 **Auto-disconnect** after 60s idle

---

## 📁 Project Structure

```
tcp-chat-server/
├── src/
│   ├── server/
│   │   ├── ChatServer.js       # Main TCP server
│   │   ├── ClientManager.js    # Client state management
│   │   └── CommandHandler.js   # Command processing
│   ├── utils/
│   │   ├── Logger.js           # Colored logging
│   │   └── Constants.js        # App constants
│   └── index.js                # Entry point
├── config/
│   └── config.js               # Configuration
├── tests/
│   └── test-client.js          # Test client
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Run Server
```bash
# Default port 4000
node src/index.js

# Custom port
node src/index.js 5000

# Or use npm
npm start
```

### Connect Clients
```bash
# Terminal 1
nc localhost 4000

# Terminal 2
nc localhost 4000

# Terminal 3
nc localhost 4000
```

---

## 📖 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `LOGIN <username>` | Login (required first) | `LOGIN Alice` |
| `MSG <text>` | Send message to all | `MSG Hello everyone!` |
| `WHO` | List active users | `WHO` |
| `DM <user> <text>` | Private message | `DM Bob Hey there!` |
| `PING` | Check connection | `PING` |

---

## 💡 Example Usage

### Terminal 1 - Server
```bash
$ node src/index.js
[SERVER] Chat server started on 0.0.0.0:4000
[SERVER] Waiting for connections...
[SERVER] Alice logged in
[CHAT] Alice: Hello!
[SERVER] Bob logged in
[CHAT] Bob: Hi Alice!
[DM] Alice -> Bob: Private message
```

### Terminal 2 - Alice
```bash
$ nc localhost 4000
LOGIN Alice
OK
MSG Hello!
MSG Bob Hi Alice!
DM Bob Private message
DM-SENT Bob
```

### Terminal 3 - Bob
```bash
$ nc localhost 4000
LOGIN Bob
OK
MSG Alice Hello!
MSG Hi Alice!
DM Alice Private message
WHO
USER Alice
USER Bob
```

---

## 🏗️ Architecture

```
Client → ChatServer → ClientManager → Broadcast to all
                   → CommandHandler → Process MSG/WHO/DM/PING
```

**Design:**
- `ChatServer.js` - Handles TCP connections and buffering
- `ClientManager.js` - Manages client state and broadcasting
- `CommandHandler.js` - Processes commands (MSG, WHO, DM, PING)
- `Logger.js` - Colored console output
- `Constants.js` - Centralized configuration

---

## 🎬 Screen Recording

**📹 Video Demo:** [https://drive.google.com/file/d/1LKb5cGBunvvlVS7somQmCgoWTokcr40o/view?usp=drivesdk]

### What to Show (1-2 minutes):
1. Start server: `node src/index.js`
2. Connect 3 clients with `nc localhost 4000`
3. Each login: `LOGIN Alice`, `LOGIN Bob`, `LOGIN Charlie`
4. Send messages: `MSG Hello!`
5. Test `WHO` command
6. Test `DM Bob Secret message`
7. Disconnect one user (Ctrl+C)
8. Show disconnect notification
9. Stop server (Ctrl+C)

---

## ⚙️ Configuration

```bash
# Environment variables
CHAT_PORT=4000 node src/index.js
CHAT_HOST=0.0.0.0 node src/index.js

# Or command line
node src/index.js 3000
```

---

## 🧪 Testing

```bash
# Automated test
npm test

# Manual test
# Open 3 terminals, run nc localhost 4000 in each
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process
lsof -ti:4000 | xargs kill -9

# Or use different port
node src/index.js 5000
```

**Can't connect:**
- Check server is running
- Verify port matches
- Try `nc 127.0.0.1 4000`

**Module not found:**
- Ensure `config/config.js` doesn't have `require('dotenv')`

---

## 🔒 Security Note

⚠️ **Educational project only!** For production, add:
- TLS/SSL encryption
- Proper authentication
- Rate limiting
- Input sanitization

---

## 📝 License

MIT License - Free to use and modify

---

## 👨‍💻 Author

**Your Name**
- Assignment: TCP Chat Server
- Built with: Node.js (standard library only)

---

<div align="center">

**⭐ Star this repo if you found it helpful! ⭐**

Made with ❤️ using Node.js

</div>