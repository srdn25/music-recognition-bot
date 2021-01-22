const axios = require('axios');
const Provider = require('./Provider');
const {
  redisKeys,
  log,
} = require('../utilities');

const _getLinkFromHtml = (html) => {
  try {
    const part = html.split('<script id="__NEXT_DATA__" type="application/json" crossorigin="anonymous">')[ 1 ];
    const jsonString = part.split('</script>')[ 0 ];
    return JSON.parse(jsonString).props.pageProps.itemInfo.itemStruct.music;
  } catch (err) {
    log.error(err);
    throw Error('Can\'t get link to music from tiktok page');
  }
};

class Tiktok extends Provider {
  constructor() {
    super();
    this.redisKeys = redisKeys.tiktok;
  }

  async getMusicLink (link) {
    try {
      const { data = null } = await axios.get(link, {
        headers: {
          rip: 'www.tiktok.com',
          'content-type': 'text/html; charset=utf-8',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
          referer: 'https://www.tiktok.com/',
          cookie: `tt_webid_v2=${link}`,
        }
      });

      if (!data) {
        throw Error('Can\'t get data from tiktok');
      }

      const result = _getLinkFromHtml(data);

      if (!result || !result.playUrl) {
        throw Error('Can\'t get music link');
      }

      return {
        high: result.playUrl,
        default: result.playUrl,
        title: result.title || null,
        coverThumb: result.coverThumb || null,
      };

    } catch (err) {
      // eslint-disable-next-line no-prototype-builtins
      if (typeof err === 'object' && !err.hasOwnProperty('message')) {
        log.error(err);
        throw 'Unexpected error when try get music link from tiktok';
      } else {
        throw err.message || err;
      }
    }
  }
}

module.exports = Tiktok;
