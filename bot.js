const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Your original bot code
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store users info
let users = {};
let botStats = {
    usersRegistered: 0,
    commandsProcessed: 0,
    startTime: new Date()
};

// --- Web Panel ---
app.get('/', (req, res) => {
    const uptime = Math.floor((new Date() - botStats.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Master Hack Bot Panel</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea, #764ba2);
                margin: 0; 
                padding: 20px;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 { 
                color: #333; 
                text-align: center;
                margin-bottom: 30px;
            }
            .status-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 15px 0;
                border-left: 4px solid #4CAF50;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: #333;
            }
            .stat-label {
                color: #666;
            }
            .online-badge {
                background: #4CAF50;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Master Hack Bot Control Panel</h1>
            <div class="online-badge">🟢 ONLINE 24/7</div>
            
            <div class="status-card">
                <div class="stat-number">${botStats.usersRegistered}</div>
                <div class="stat-label">Users Registered</div>
            </div>
            
            <div class="status-card">
                <div class="stat-number">${botStats.commandsProcessed}</div>
                <div class="stat-label">Commands Processed</div>
            </div>
            
            <div class="status-card">
                <div class="stat-number">${hours}h ${minutes}m</div>
                <div class="stat-label">Uptime</div>
            </div>
            
            <div class="status-card">
                <h3>Bot Features:</h3>
                <p>✅ Multi-language support</p>
                <p>✅ Country selection</p>
                <p>✅ User registration</p>
                <p>✅ Admin messaging</p>
                <p>✅ 24/7 Online</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

// --- Your Original Bot Commands ---

// --- Start Command ---
bot.onText(/\/start/, (msg) => {
    botStats.commandsProcessed++;
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 Hello ${msg.from.first_name}! Welcome to Master Hack Bot ✅\n\nSelect your language:`, {
        reply_markup: {
            keyboard: [
                ["English 🇬🇧", "French 🇫🇷"],
                ["Spanish 🇪🇸", "German 🇩🇪"]
            ],
            one_time_keyboard: true
        }
    });
});

// --- Language Selection ---
bot.on('message', (msg) => {
    if (!msg.text) return;
    
    const chatId = msg.chat.id;
    const text = msg.text;

    if (["English 🇬🇧","French 🇫🇷","Spanish 🇪🇸","German 🇩🇪"].includes(text)) {
        users[chatId] = { language: text };
        botStats.commandsProcessed++;
        bot.sendMessage(chatId, `🌍 Great! Now select your country:`, {
            reply_markup: {
                keyboard: [["Nigeria 🇳🇬","USA 🇺🇸"], ["UK 🇬🇧","Canada 🇨🇦"]],
                one_time_keyboard: true
            }
        });
    } else if (["Nigeria 🇳🇬","USA 🇺🇸","UK 🇬🇧","Canada 🇨🇦"].includes(text)) {
        if (!users[chatId]) users[chatId] = {};
        users[chatId].country = text;
        botStats.usersRegistered++;
        botStats.commandsProcessed++;
        bot.sendMessage(chatId, `✅ Registration complete!\nName: ${msg.from.first_name}\nLanguage: ${users[chatId].language}\nCountry: ${text}\n\nType /help for all commands`);
    }
});

// --- Help Command ---
bot.onText(/\/help/, (msg) => {
    botStats.commandsProcessed++;
    bot.sendMessage(msg.chat.id, "Available commands:\n/start - Start bot\n/help - Help menu\n/register - Register your name\n/admin - Message admin");
});

// --- Register Command ---
bot.onText(/\/register/, (msg) => {
    botStats.commandsProcessed++;
    users[msg.chat.id] = { name: msg.from.first_name };
    botStats.usersRegistered++;
    bot.sendMessage(msg.chat.id, `✅ You are now registered, ${msg.from.first_name}!`);
});

// --- Admin Message Command ---
bot.onText(/\/admin/, (msg) => {
    botStats.commandsProcessed++;
    bot.sendMessage(msg.chat.id, "📬 Send your message to admin:");
    bot.once('message', (reply) => {
        console.log(`Admin message from ${msg.from.username || msg.from.first_name}: ${reply.text}`);
        bot.sendMessage(msg.chat.id, "✅ Your message has been sent to admin!");
    });
});

// Start web server
app.listen(port, () => {
    console.log(`🤖 Bot + Web Panel running on port ${port}`);
    console.log("🌐 Web panel is available at: http://localhost:" + port);
});

console.log("Bot is running...");