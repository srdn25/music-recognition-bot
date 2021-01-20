const axios = require('axios');
const Provider = require('./Provider');

const _getLinkFromHtml = async (html) => {
  try {
    const part = html.split('<script id=\'coubPageCoubJson\' type=\'text/json\'>')[ 1 ];
    const jsonString = part.split('</script>')[ 0 ];
    return JSON.parse(jsonString).file_versions;
  } catch (err) {
    console.log(err);
    throw 'Can\'t get link to music from coub page';
  }
};

class Coube extends Provider {
  constructor() {
    super();
  }

  static async getMusicLink (link) {
    try {
      const { data = null } = await axios.get(link);

      if (!data) {
        throw 'Can\'t get data from coub';
      }

      const result = _getLinkFromHtml(data);

      if (!result) {
        throw 'Can\'t get music link';
      }

      return {
        high: result.html5.audio.high.url,
        default: result.mobile.audio[ 0 ],
      };

    } catch (err) {
      console.log(err);
      throw 'Unexpected error when try get music link from coub';
    }
  }
}

module.exports = Coube;
