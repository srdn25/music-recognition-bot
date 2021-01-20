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
   * @returns {object} data Response
   * @returns {string} data.default Default quality link is required
   * @returns {string} data.high High quality link
   */
  getMusicLink () {
    throw Error('Method getMusicLink must be implement');
  }
}

module.exports = Provider;
