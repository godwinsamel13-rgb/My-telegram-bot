const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN; // Set in Railway
const bot = new TelegramBot(token, { polling: true });

// Store users info
let users = {};

// --- Start Command ---
bot.onText(/\/start/, (msg) => {
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
  const chatId = msg.chat.id;
  const text = msg.text;

  if (["English 🇬🇧","French 🇫🇷","Spanish 🇪🇸","German 🇩🇪"].includes(text)) {
    users[chatId] = { language: text };
    bot.sendMessage(chatId, `🌍 Great! Now select your country:`, {
      reply_markup: {
        keyboard: [["Nigeria 🇳🇬","USA 🇺🇸"], ["UK 🇬🇧","Canada 🇨🇦"]],
        one_time_keyboard: true
      }
    });
  } else if (["Nigeria 🇳🇬","USA 🇺🇸","UK 🇬🇧","Canada 🇨🇦"].includes(text)) {
    users[chatId].country = text;
    bot.sendMessage(chatId, `✅ Registration complete!\nName: ${msg.from.first_name}\nLanguage: ${users[chatId].language}\nCountry: ${text}\n\nType /help for all commands`);
  }
});

// --- Help Command ---
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "Available commands:\n/start - Start bot\n/help - Help menu\n/register - Register your name\n/admin - Message admin");
});

// --- Register Command ---
bot.onText(/\/register/, (msg) => {
  users[msg.chat.id] = { name: msg.from.first_name };
  bot.sendMessage(msg.chat.id, `✅ You are now registered, ${msg.from.first_name}!`);
});

// --- Admin Message Command ---
bot.onText(/\/admin/, (msg) => {
  bot.sendMessage(msg.chat.id, "📬 Send your message to admin:");
  bot.once('message', (reply) => {
    console.log(`Admin message from ${msg.from.username || msg.from.first_name}: ${reply.text}`);
    bot.sendMessage(msg.chat.id, "✅ Your message has been sent to admin!");
  });
});

console.log("Bot is running...");
