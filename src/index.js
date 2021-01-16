const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  require('dotenv').config();
}

const Telegraf = require('telegraf');
const bot = new Telegraf(TG_BOT_TOKEN);

bot.catch((err) => console.log(err));

if (TG_BOT_CLEAN === 'enabled') {
  bot.use(botCleanSelfMessages);
  console.log('TG_BOT: Clean bot after self is enabled');
}

if (TG_BOT_ALERT === 'enabled') {
  bot.command('alert', alertCmd);
  console.log('TG_BOT: Alert bot is enabled');
}

if (TG_BOT_BAN_FEATURE === 'enabled') {
  bot.command('ban', banCmd);
  // bot.on('message', banResponse);
  console.log('TG_BOT: Ban feature is enabled');
}

bot.on('message', (ctx) => {
  if (TG_BOT_BAN_FEATURE === 'enabled') banResponse(ctx);
  if (TG_BOT_SEARCH_FEATURE === 'enabled') searchInGoogleFun(ctx);
  if (TG_BOT_READONLY_FEATURE === 'enabled') readOnlyFeature(ctx);
});

bot.launch();
