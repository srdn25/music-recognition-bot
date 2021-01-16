const isProd = process.env.NODE_ENV === 'production';

const getName = (from) => {
  return from.first_name || from.last_name || from.username || `NoName_id:${from.id}`;
};

module.exports = {
  isProd,
  getName,
};
