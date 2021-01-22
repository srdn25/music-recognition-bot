const redisService = require('redis');
const redisScan = require('node-redis-scan');
const { log } = require('../utilities');

const {
  MUSIC_BOT_REDIS_PORT,
  MUSIC_BOT_REDIS_ENDPOINT,
  MUSIC_BOT_REDIS_PASSWORD,
} = process.env;

const clientOptions = {
  prefix: 'tg_music_recognition_bot:',
  ...(MUSIC_BOT_REDIS_ENDPOINT && { host: MUSIC_BOT_REDIS_ENDPOINT }),
  ...(MUSIC_BOT_REDIS_PORT && { port: MUSIC_BOT_REDIS_PORT }),
  ...(MUSIC_BOT_REDIS_PASSWORD && { password: MUSIC_BOT_REDIS_PASSWORD }),
};

const client = redisService.createClient(clientOptions);
const scanner = new redisScan(client);

client.on('error', function (err) {
  log.info('TG_BOT redis ERR');
  log.error(err);
});

const setKeyExp = (key, value, seconds, cb) => client.setex(key, seconds, value, cb);

const setKey = (key, value) => client.set(key, value);

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
  setKey,
  removeKey,
  getKey,
  scanByPattern,
};
