const path = require('path');

const Coube = require('../services/coube.service');
const Youtube = require('../services/youtube.service');
const Tiktok = require('../services/tiktok.service');

const { log } = require('../utilities');

const coube = new Coube();
const youtube = new Youtube();
const tiktok = new Tiktok();

const thumb = path.join(__dirname, '../attachments/logo.jpg');

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
  const videoId = parsedMessage[7];

  switch (site) {
    case 'coub':
      try {
        const redisData = await coube.getMusicDataFromRedis(videoId);

        if (redisData) {
          await ctx.telegram.sendAudio(
            ctx.chat.id,
            { url: redisData.high, filename: redisData.title || 'Unknown' },
            {
              title: redisData.title || 'Unknown',
              reply_to_message_id: ctx.message.message_id,
              thumb,
            },
          );

          return;
        }

        const link = await coube.getMusicLink(message);

        coube.saveMusicDataToRedis({ videoId, music: link });

        await ctx.telegram.sendAudio(
          ctx.chat.id,
          { url: link.high, filename: link.title || 'Unknown' },
          {
            title: link.title || 'Unknown',
            reply_to_message_id: ctx.message.message_id,
            thumb,
          },
        );
      } catch (err) {
        log.error(err);
        if (typeof err === 'object' || !err.message) {
          ctx.reply('Unknown error');
        } else {
          ctx.reply(err.message || err);
        }
      }
      break;
    case 'youtu':
    case 'youtube':
      try {
        const redisData = await youtube.getMusicDataFromRedis(videoId);

        if (redisData) {
          await ctx.telegram.sendAudio(
            ctx.chat.id,
            { url: redisData.high, filename: redisData.title || 'Unknown' },
            {
              title: redisData.title || 'Unknown',
              reply_to_message_id: ctx.message.message_id,
              thumb,
            },
          );

          return;
        }

        const link = await youtube.getMusicLink(message);

        youtube.saveMusicDataToRedis({ videoId, music: link });

        await ctx.telegram.sendAudio(
          ctx.chat.id,
          { url: link.high, filename: link.title || 'Unknown' },
          {
            title: link.title || 'Unknown',
            reply_to_message_id: ctx.message.message_id,
            thumb,
          },
        );
      } catch (err) {
        log.error(err);
        if (typeof err === 'object' || !err.message) {
          ctx.reply('Unknown error');
        } else {
          ctx.reply(err.message || err);
        }
      }
      break;
    case 'tiktok':
      try {
        const redisData = await tiktok.getMusicDataFromRedis(videoId);

        // TODO: if redisData.title is null ask this in ARC
        if (redisData) {
          await ctx.telegram.sendAudio(
            ctx.chat.id,
            { url: redisData.high, filename: redisData.title || 'Unknown' },
            {
              title: redisData.title || 'Unknown',
              reply_to_message_id: ctx.message.message_id,
              thumb: redisData.coverThumb || thumb,
            },
          );

          return;
        }

        const link = await tiktok.getMusicLink(message);

        // TODO: if link.title is null ask this in ARC
        youtube.saveMusicDataToRedis({ videoId, music: link });

        await ctx.telegram.sendAudio(
          ctx.chat.id,
          { url: link.high, filename: link.title || 'Unknown' },
          {
            title: link.title || 'Unknown',
            reply_to_message_id: ctx.message.message_id,
            thumb: link.coverThumb || thumb,
          },
        );
      } catch (err) {
        log.error(err);
        if (typeof err === 'object' || !err.message) {
          ctx.reply('Unknown error');
        } else {
          ctx.reply(err.message || err);
        }
      }
      break;

    default:
      ctx.reply('Support other websites in development. For help you can donate BTC to wallet in bot about');
  }

};

module.exports = downloadAndRecognition;
