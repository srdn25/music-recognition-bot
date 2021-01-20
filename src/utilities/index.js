const isProd = process.env.NODE_ENV === 'production';

const getName = (from) => {
  return from.first_name || from.last_name || from.username || `NoName_id:${from.id}`;
};

const promisifyWrapper = (fnWithCb, payload) => {
  return new Promise((resolve, reject) => {
    fnWithCb(...payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
};

module.exports = {
  isProd,
  getName,
  promisifyWrapper,
  redisKeys: require('./redisKeys'),
};
