const { getName } = require('../utilities');

const startCmd = async (ctx) => {
  await ctx.replyWithHTML(
    `<b>Dear ${getName(ctx.from)}, thanks for using this bot.
Just send link from youtube or coub to message for recognition music</b>`
  );
};

module.exports = startCmd;
