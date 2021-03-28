const fs = require('fs');
const loader = require('@assemblyscript/loader');

require('./go/misc/wasm/wasm_exec');

const go = new Go();

(async () => {
  try {
    const path = __dirname.split('/node_modules')[0];
    if (!fs.existsSync(`${path}/main.wasm`)) {
      throw new Error('There is no "main.wasm" file in the root the project');
    }

    const wasm = fs.readFileSync(`${path}/main.wasm`);
    const wasmModule = loader.instantiateSync(wasm, go.importObject);
    await go.run(wasmModule.instance);
  } catch (err) {
    console.error(err.message);
  }
})();
