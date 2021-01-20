const youtubeDl = require('youtube-dl');
const Provider = require('./Provider');

class Youtube extends Provider {
  constructor() {
    super();
  }

  static async getMusicLink (link) {
    try {
      youtubeDl.exec(
        link,
        ['-x', '--audio-format', 'mp3'],
        {},
        (err, output) => {
          if (err) {
            console.log('Error while tried get music from youtube');
            throw Error(err);
          }

          if (!output) {
            throw 'Can\'t get music link';
          }

          return {
            high: null,
            default: output,
          };
        });

    } catch (err) {
      console.log(err);
      throw 'Unexpected error when try get music link from youtube';
    }
  }
}

module.exports = Youtube;
