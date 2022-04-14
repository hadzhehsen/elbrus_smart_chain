const { startCreating, buildSetup } = require('./src/main');

const start = async (wallet) => {
  buildSetup(wallet);
  await startCreating(wallet);
};

module.exports = start;
