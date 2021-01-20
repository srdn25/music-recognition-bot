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
}

module.exports = Provider;
