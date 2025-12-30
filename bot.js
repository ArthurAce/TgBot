const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const quotes = require("./quotes");
const trueFalse = require("./truefalse");
const predictions = require("./predictions");

const BOT_TOKEN = "8212447501:AAHhVncuhQjebPuRmySnJFmwRy5CzLVTl3A";
const CHAT_ID = "-1003299472433";

const bot = new Telegraf(BOT_TOKEN);

const lastPrediction = {};
const COOLDOWN = 12 * 60 * 60 * 1000;


function sendQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  bot.telegram.sendMessage(CHAT_ID, `💬 Цитата дня:\n\n${quote}`);
}

cron.schedule("0 11 * * *", sendQuote);
cron.schedule("0 19 * * *", sendQuote);

function sendTrueFalse() {
  const item = trueFalse[Math.floor(Math.random() * trueFalse.length)];

  bot.telegram.sendMessage(
    CHAT_ID,
    `🎮 Правда или ложь?\n\n❓ ${item.text}\n\nПиши: правда / ложь`
  );


  setTimeout(() => {
    bot.telegram.sendMessage(
      CHAT_ID,
      `✅ Ответ: ${item.answer ? "ПРАВДА" : "ЛОЖЬ"}\n\n📌 ${item.explanation}`
    );
  }, 10 * 60 * 1000);
}


cron.schedule("30 14 * * *", sendTrueFalse);

bot.command("quote", (ctx) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  ctx.reply(`💬 ${quote}`);
});

bot.command("game", () => {
  sendTrueFalse();
});

bot.command("predict", (ctx) => {
  const userId = ctx.from.id;
  const now = Date.now();


  if (lastPrediction[userId] && now - lastPrediction[userId] < COOLDOWN) {
    const remaining = Math.ceil((COOLDOWN - (now - lastPrediction[userId])) / (60 * 60 * 1000));
    return ctx.reply(`⏳ Подожди ещё ${remaining} ч, прежде чем получить новое предсказание.`);
  }

  lastPrediction[userId] = now;

  const user = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const prediction = predictions[Math.floor(Math.random() * predictions.length)];

  ctx.reply(`🔮 ${user}, ${prediction}`);
});


bot.launch();
console.log("🤖 Бот запущен");
