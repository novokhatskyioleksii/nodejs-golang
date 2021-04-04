const { instantiate } = require('./index');

(async () => {
  const scriptName = process.argv[2] || '';
  await instantiate(scriptName);
})();
