const { isProd } = require('./utilities');

if (!isProd) {
  require('dotenv').config();
}

const {
  TG_BOT_TOKEN,
  RECOGNITION_BOT_MUSIC_WORKING,
  REASON_FOR_DISABLED_RECOGNITION_BOT_MUSIC,
} = process.env;

const {
  helpCmd,
  startCmd,
} = require('./commands');

const Telegraf = require('telegraf');
const bot = new Telegraf(TG_BOT_TOKEN);

bot.catch((err) => console.log(err));

bot.command('help', helpCmd);
bot.command('start', startCmd);

bot.on('message', (ctx) => {
  if (RECOGNITION_BOT_MUSIC_WORKING === 'enabled') {
    // TODO: middleware for handle message
  } else {
    // TODO: send response about disabled bot REASON_FOR_DISABLED_RECOGNITION_BOT_MUSIC
  }
});

bot.launch();
