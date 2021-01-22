const { log } = require('../utilities');

const handleSwitchCaseErrors = (err, sendReply) => {
  log.error(err);
  if (typeof err === 'object' || !err.message) {
    sendReply('Unknown error');
  } else {
    sendReply(err.message || err);
  }
};

module.exports = {
  handleSwitchCaseErrors,
};
