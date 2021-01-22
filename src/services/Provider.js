/**
 * Abstract provider class
 * @class
 * @classdesc Provider should have next methods: getMusicLink
 */
class Provider {
  constructor() {
    if (this.constructor === Provider) {
      throw Error('Abstract classes cant be initialised');
    }
  }

  /**
   * Get music link from video
   * @returns {Promise<object>} data Response
   * @returns {string} data.default Default quality link is required
   * @returns {string} data.high High quality link
   * @returns {string} data.title Name from link
   */
  async getMusicLink () {
    throw Error('Method getMusicLink must be implement');
  }

  /**
   * Get cached data
   * @param {object} data Payload
   * @param {string} data.provider Provider name
   * @param {string} data.videoId Video id on provider resource
   * @returns {Promise<object> | null} result Return data from redis.
   * If not found, return null
   * @returns {string | null} result.high Music link with high quality
   * @returns {string} result.default Music link with low quality
   * @returns {string | null} result.title Music title
   * @returns {string | null} result.author Music author
   * @returns {string | null} result.coverThumb Music link to poster
   */
  // eslint-disable-next-line no-unused-vars
  async getRedisData (data) {
    throw Error('Method getRedisData must be implement');
  }

  /**
   * Save data to cache
   * @param {object} data Payload
   * @param {string} data.provider Provider name
   * @param {string} data.videoId Video id on provider resource
   * @param {object} music Music data
   * @param {string | null} data.music.high Music link with high quality
   * @param {string} data.music.default Music link with low quality
   * @param {string | null} data.music.title Music title
   * @param {string | null} data.music.author Music author
   * @param {string | null} data.music.coverThumb Music link to poster
   */
  // eslint-disable-next-line no-unused-vars
  async saveRedisData (data) {
    throw Error('Method saveRedisData must be implement');
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
  // eslint-disable-next-line no-unused-vars
  async sendResultToTelegram (data) {
    throw Error('Method sendResultToTelegram must be implement');
  }
}

module.exports = Provider;
