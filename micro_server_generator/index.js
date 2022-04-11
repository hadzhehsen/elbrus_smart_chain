const { startCreating, buildSetup } = require('./src/main');

const start = () => {
  buildSetup();
  startCreating();
};

module.exports = start;
