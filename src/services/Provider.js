const path = require('path');

const {
  setKey: redisSet,
  setKeyExp: redisSetEx,
  getKey: redisGet,
} = require('./redis.service');

const { handleSwitchCaseErrors } = require('../handlers/errors.handler');

/**
 * Provider class
 * @class
 * @classdesc Provider should have next methods: getMusicLink
 */
class Provider {
  constructor() {
    if (this.constructor === Provider) {
      throw Error('Abstract classes cant be initialised');
    }
    this.redisKeys = {};
    this.appLogo = path.join(__dirname, '../attachments/logo.jpg');
    this.defaultThumb = this.appLogo;
  }

  /**
   * Get music link from video
   * @param {string} link Video link
   * @returns {Promise<object>} data Response
   * @returns {string} data.default Default quality link is required
   * @returns {string} data.high High quality link
   * @returns {string} data.title Name from link
   * @returns {string | null} result.author Music author
   * @returns {string | null} result.coverThumb Music link to poster
   */
  async getMusicLink () {
    throw Error('Method getMusicLink must be implement');
  }

  /**
   * Get cached data
   * @param {string} videoId Video id on provider resource
   * @returns {Promise<object> | null} result Return data from redis.
   * If not found, return null
   * @returns {string | null} result.high Music link with high quality
   * @returns {string} result.default Music link with low quality
   * @returns {string | null} result.title Music title
   * @returns {string | null} result.author Music author
   * @returns {string | null} result.coverThumb Music link to poster
   */
  async getMusicDataFromRedis (videoId) {
    const redisKey = `${this.redisKeys.musicLinkByVideoId}:${videoId}`;
    const redisData = await redisGet(redisKey);

    if (redisData) {
      return JSON.parse(redisData);
    }

    return null;
  }

  /**
   * Save data to cache
   * @param {object} data Payload
   * @param {string} data.videoId Video id on provider resource
   * @param {object} music Music data
   * @param {string | null} data.music.high Music link with high quality
   * @param {string} data.music.default Music link with low quality
   * @param {string | null} data.music.title Music title
   * @param {string | null} data.music.author Music author
   * @param {string | null} data.music.coverThumb Music link to poster
   */
  saveMusicDataToRedis (data) {
    const {
      videoId,
      music,
    } = data;

    const redisKey = `${this.redisKeys.musicLinkByVideoId}:${videoId}`;
    const payload = JSON.stringify(music);

    if (this.redisExTime) {
      redisSetEx(redisKey, payload, this.redisExTime);
      return;
    }

    redisSet(redisKey, payload);
  }

  /**
   * Send response message to Telegram
   * @param {object} data Payload
   * @param {object} data.tgContext Telegram client context
   * @param {object} data.music Music data
   * @param {string | null} music.high Music link with high quality
   * @param {string} music.default Music link with low quality
   * @param {string | null} music.title Music title
   * @param {string | null} music.author Music author
   * @param {string | null} music.coverThumb Music link to poster
   * @returns {Promise} null
   */
  async sendResultToTelegram (data) {
    const {
      tgContext,
      music,
    } = data;

    // TODO: send text info about music

    await tgContext.telegram.sendAudio(
      tgContext.chat.id,
      { url: music.high || music.default, filename: music.title || 'Unknown' },
      {
        title: music.title || 'Unknown',
        reply_to_message_id: tgContext.message.message_id,
        // thumb: music.coverThumb || this.defaultThumb,
      },
    );
  }

  /**
   * Handle request for download music and recognition
   * @param {object} data Payload
   * @param {object} data.tgContext Telegram client context
   * @param {string} data.videoId Video ID
   */
  async handlerDownloadAndRecognitionRequest (data) {
    const {
      videoId,
      tgContext,
    } = data;

    try {
      const message = tgContext.message.text;

      const redisData = await this.getMusicDataFromRedis(videoId);

      // TODO: if redisData.title is null ask this in ARC
      if (redisData) {
        await this.sendResultToTelegram({ tgContext, music: redisData });
        return;
      }

      // TODO: if link.title is null ask this in ARC
      const music = await this.getMusicLink(message);

      this.saveMusicDataToRedis({ videoId, music });

      await this.sendResultToTelegram({ tgContext, music });
    } catch (err) {
      handleSwitchCaseErrors(err, tgContext.reply);
    }
  }
}

module.exports = Provider;
