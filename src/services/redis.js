const redis = require('redis');
const redisScan = require('node-redis-scan');

const {
  REDIS_PORT,
  REDIS_ENDPOINT,
  REDIS_PASSWORD,
} = process.env;

const clientOptions = {
  prefix: 'tg_music_recognition_bot:',
  ...(REDIS_ENDPOINT && { host: REDIS_ENDPOINT }),
  ...(REDIS_PORT && { port: REDIS_PORT }),
  ...(REDIS_PASSWORD && { password: REDIS_PASSWORD }),
};

const client = redis.createClient(clientOptions);
const scanner = new redisScan(client);

client.on('error', function (err) {
  console.log('TG_BOT redis ERR');
  console.error(err);
});

const setKeyExp = (key, value, seconds, cb) => client.setex(key, seconds, value, cb);

const removeKey = (key) => new Promise((resolve, reject) => {
  client.del(key, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

const getKey = (key) => new Promise((resolve, reject) => {
  client.get(key, function (err, value) {
    if (err) reject(err);
    resolve(value);
  });
});

const scanByPattern = (pattern, limit = 17) => new Promise((resolve, reject) => {
  scanner.scan(pattern, { count: limit }, (err, keys) => {
    if (err) reject(err);
    resolve(keys);
  });
});

module.exports = {
  client,
  setKeyExp,
  removeKey,
  getKey,
  scanByPattern,
};
