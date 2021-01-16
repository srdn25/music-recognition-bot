const { isProd } = require('./utilities');

if (!isProd) {
  require('dotenv').config();
}

const {
  TG_MUSIC_BOT_TOKEN,
  RECOGNITION_BOT_MUSIC_WORKING,
  REASON_FOR_DISABLED_RECOGNITION_BOT_MUSIC,
} = process.env;

const {
  helpCmd,
  startCmd,
} = require('./commands');

const {
  downloadAndRecognition,
} = require('./middlewares');

const Telegraf = require('telegraf');
const bot = new Telegraf(TG_MUSIC_BOT_TOKEN);

bot.catch((err) => console.log(err));

bot.command('help', helpCmd);
bot.command('start', startCmd);

bot.on('message', async (ctx) => {
  if (RECOGNITION_BOT_MUSIC_WORKING === 'enabled') {
    await downloadAndRecognition(ctx);
  } else {
    await ctx.replyWithHTML(
      `<b>${REASON_FOR_DISABLED_RECOGNITION_BOT_MUSIC}</b>`
    );
  }
});

bot.launch();
