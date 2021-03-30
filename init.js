const { GO_MODULE_NAME } = require('./constants');
const { init } = require('./index');

(async () => {
  const scriptName = process.env[GO_MODULE_NAME] || '';
  await init(scriptName);
})();
