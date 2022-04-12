const { startCreating, buildSetup } = require('./src/main');

const start = (wallet) => {
  buildSetup(wallet);
  startCreating(wallet);
};

module.exports = start;
