const { GO_MODULE_NAME } = require('./constants');
const { build } = require('./index');

(async () => {
  const scriptName = process.env[GO_MODULE_NAME] || '';
  await build(scriptName);
})();
