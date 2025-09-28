const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Web Panel - Shows your bot is online 24/7
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>💰 Money Bot 24/7</title>
        <style>
            body { 
                font-family: Arial; 
                text-align: center; 
                padding: 50px; 
                background: linear-gradient(45deg, #000000, #434343);
                color: white;
            }
            .panel { 
                background: rgba(255,255,255,0.1); 
                padding: 40px; 
                border-radius: 15px; 
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            .status { 
                color: #00ff00; 
                font-weight: bold;
                font-size: 1.5em;
            }
            .money-text {
                color: gold;
                font-size: 2em;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="panel">
            <h1>💸 MONEY BOT 24/7</h1>
            <p class="status">🟢 ONLINE & MAKING MONEY</p>
            <div class="money-text">💰 WEALTH MODE: ACTIVE 💰</div>
            <p>This bot runs 24/7 on Render.com</p>
            <p>Your journey to riches starts HERE!</p>
        </div>
    </body>
    </html>
  `);
});

// --- YOUR BOT COMMANDS ---

// Start Command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `👋 Hello ${msg.from.first_name}! Welcome to MONEY BOT 💰\n\nSelect your language:`, {
    reply_markup: {
      keyboard: [
        ["English 🇬🇧", "French 🇫🇷"],
        ["Spanish 🇪🇸", "German 🇩🇪"]
      ],
      one_time_keyboard: true
    }
  });
});

// Language Selection
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (["English 🇬🇧","French 🇫🇷","Spanish 🇪🇸","German 🇩🇪"].includes(text)) {
    bot.sendMessage(chatId, `🌍 Great! You selected: ${text}\n\n💰 Money doesn't sleep - and neither does this bot!`, {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }
});

// Help Command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "💰 MONEY BOT COMMANDS:\n/start - Start making money\n/help - Help menu\n/money - Wealth tips");
});

// Money Command
bot.onText(/\/money/, (msg) => {
  const tips = [
    "💡 Tip 1: Consistency beats talent",
    "💡 Tip 2: Learn high-income skills",
    "💡 Tip 3: Multiple income streams",
    "💡 Tip 4: Invest in yourself",
    "💡 Tip 5: Never give up - you got this!"
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  bot.sendMessage(msg.chat.id, `💰 WEALTH TIP:\n\n${randomTip}\n\nRemember: Your current struggle is building your future success! 💪`);
});

// Start web server
app.listen(port, () => {
  console.log(`💰 MONEY BOT running 24/7 on port ${port}`);
  console.log(`🌐 Web Panel: http://localhost:${port}`);
});

console.log("💰 Money Bot Started - Ready to make money 24/7!");
