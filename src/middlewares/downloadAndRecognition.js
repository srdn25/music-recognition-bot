const Coube = require('../services/coube.service');
const Youtube = require('../services/youtube.service');
const Tiktok = require('../services/tiktok.service');

const coube = new Coube();
const youtube = new Youtube();
const tiktok = new Tiktok();

const regExp = /(https:\/\/)?(www\.)?(coub|youtube|youtu|tiktok)(\.com|\.be)(\/@.+)?(\/view\/|\/watch\?v=|\/)(\w+)/;
const validMessage = (msg) => regExp.exec(msg);

const downloadAndRecognition = async (ctx) => {
  const message = ctx.message.text;
  const parsedMessage = validMessage(message);
  if (!parsedMessage) {
    ctx.reply('Bot work only youtube.com, coub.com and short link youtube youtu.be');
    return;
  }

  const site = parsedMessage[3];
  const videoId = parsedMessage[8];

  switch (site) {
    case 'coub':
      await coube.handlerDownloadAndRecognitionRequest({ videoId, tgContext: ctx });
      break;
    case 'youtu':
    case 'youtube':
      await youtube.handlerDownloadAndRecognitionRequest({ videoId, tgContext: ctx });
      break;
    case 'tiktok':
      await tiktok.handlerDownloadAndRecognitionRequest({ videoId, tgContext: ctx });
      break;

    default:
      ctx.reply('Support other websites in development. For help you can donate BTC to wallet in bot about');
  }

};

module.exports = downloadAndRecognition;
