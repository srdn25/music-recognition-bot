const axios = require('axios');
const Provider = require('./Provider');
const { log } = require('../utilities');

const _getLinkFromHtml = (html) => {
  try {
    const part = html.split('<script id=\'coubPageCoubJson\' type=\'text/json\'>')[ 1 ];
    const jsonString = part.split('</script>')[ 0 ];
    return JSON.parse(jsonString).file_versions;
  } catch (err) {
    log.error(err);
    throw Error('Can\'t get link to music from coub page');
  }
};

class Coube extends Provider {
  constructor() {
    super();
  }

  async getMusicLink (link) {
    try {
      const { data = null } = await axios.get(link);

      if (!data) {
        throw Error('Can\'t get data from coub');
      }

      const result = _getLinkFromHtml(data);

      if (!result) {
        throw Error('Can\'t get music link');
      }

      return {
        high: result.html5.audio.high.url,
        default: result.mobile.audio[ 0 ],
        title: null,
      };

    } catch (err) {
      // eslint-disable-next-line no-prototype-builtins
      if (typeof err === 'object' && !err.hasOwnProperty('message')) {
        log.error(err);
        throw 'Unexpected error when try get music link from coub';
      } else {
        throw err.message || err;
      }
    }
  }
}

module.exports = Coube;
