const youtubeDl = require('youtube-dl');
const Provider = require('./Provider');
const { promisifyWrapper } = require('../utilities');

const AVAILABLE_AUDIO_FORMATS = ['mp3', 'm4a'];

const findLinkInInfo = (info) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!info.hasOwnProperty('formats') || !Array.isArray(info.formats)) {
    throw 'Video data hasn\'t correct structure';
  }

  return info.formats.filter(
    (el) => el.format.includes('audio only') && AVAILABLE_AUDIO_FORMATS.includes(el.ext)
  );
};

class Youtube extends Provider {
  constructor() {
    super();
    this.VIDEO_MAX_LENGTH = 60 * 5; // 5 mins
  }

  async getMusicLink (link) {
    try {
      const videoInfo = await promisifyWrapper(youtubeDl.getInfo, [ link, [] ]);

      if (!videoInfo || videoInfo._duration_raw > this.VIDEO_MAX_LENGTH) {
        throw Error('This video is too long, or can\'t get video data');
      }

      const audioList = findLinkInInfo(videoInfo);

      const sortedQuality = audioList.sort((a, b) => b.abr - a.abr);

      return {
        high: sortedQuality[0],
        default: sortedQuality[sortedQuality.length - 1],
      };
    } catch (err) {
      // eslint-disable-next-line no-prototype-builtins
      if (typeof err === 'object' && !err.hasOwnProperty('message')) {
        console.log(err);
        throw 'Unexpected error when try get music link from youtube';
      } else {
        throw err.message || err;
      }
    }
  }
}

module.exports = Youtube;
