const path = require('path');

const {
  setKey: redisSet,
  getKey: redisGet,
} = require('../services/redis.service');

const Coube = require('../services/coube.service');
const Youtube = require('../services/youtube.service');

const {
  redisKeys,
} = require('../utilities');

const coube = new Coube();
const youtube = new Youtube();

const regExp = /(https:\/\/)?(www\.)?(coub|youtube|youtu)(\.com|\.be)(\/view\/|\/watch\?v=|\/)(\w+)/;
const validMessage = (msg) => regExp.exec(msg);

const downloadAndRecognition = async (ctx) => {
  const message = ctx.message.text;
  const parsedMessage = validMessage(message);
  if (!parsedMessage) {
    ctx.reply('Bot work only youtube.com, coub.com and short link youtube youtu.be');
    return;
  }

  const site = parsedMessage[3];
  const videoId = parsedMessage[6];

  switch (site) {
    case 'coub':
      try {
        const redisKey = `${redisKeys.coub.musicLinkByVideoId}:${videoId}`;
        const thumb = path.join(__dirname, '../attachments/logo.jpg');
        const redisData = await redisGet(redisKey);

        if (redisData) {
          const jsonData = JSON.parse(redisData);
          await ctx.telegram.sendAudio(
            ctx.chat.id,
            jsonData.high,
            {
              title: jsonData.title || 'Unknown',
              reply_to_message_id: ctx.message.message_id,
              thumb,
            },
          );

          return;
        }

        const link = await coube.getMusicLink(message);

        redisSet(redisKey, JSON.stringify(link));

        await ctx.telegram.sendAudio(
          ctx.chat.id,
          link.high,
          {
            title: link.title || 'Unknown',
            reply_to_message_id: ctx.message.message_id,
            thumb,
          },
        );
      } catch (err) {
        if (typeof err === 'object') {
          ctx.reply('Unknown error');
        } else {
          ctx.reply(err);
        }
      }
      break;

    case 'youtu':
    case 'youtube':
      try {
        const redisKey = `${redisKeys.youtube.musicLinkByVideoId}:${videoId}`;
        const thumb = path.join(__dirname, '../attachments/logo.jpg');
        const redisData = await redisGet(redisKey);

        if (redisData) {
          const jsonData = JSON.parse(redisData);
          await ctx.telegram.sendAudio(
            ctx.chat.id,
            jsonData.high,
            {
              title: jsonData.title || 'Unknown',
              reply_to_message_id: ctx.message.message_id,
              thumb,
            },
          );

          return;
        }

        const link = await youtube.getMusicLink(message);

        redisSet(redisKey, JSON.stringify(link));

        await ctx.telegram.sendAudio(
          ctx.chat.id,
          link.default,
          {
            title: link.title || 'Unknown',
            reply_to_message_id: ctx.message.message_id,
            thumb,
          },
        );
      } catch (err) {
        if (typeof err === 'object') {
          ctx.reply('Unknown error');
        } else {
          ctx.reply(err);
        }
      }
      break;
    default:
      ctx.reply('Support other websites in development. For help you can donate BTC to wallet in bot about');
  }

};

module.exports = downloadAndRecognition;
