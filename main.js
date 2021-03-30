const fs = require('fs');
const loader = require('@assemblyscript/loader');

const { GO_MODULES, NODE_MODULES, MAIN_WASM } = require('./constants');

require('./go/misc/wasm/wasm_exec');

const go = new Go();

(async () => {
  try {
    const scriptName = process.argv[2];
    const path = `${__dirname.split(`/${NODE_MODULES}`)[0]}/${GO_MODULES}`;

    const wasmPath = scriptName ? `${path}/${scriptName}/${MAIN_WASM}` : `${path}/${MAIN_WASM}`;

    if (!fs.existsSync(wasmPath)) {
      throw new Error(`There is no "${MAIN_WASM}" file in ${wasmPath} directory`);
    }

    const wasm = fs.readFileSync(wasmPath);
    const wasmModule = loader.instantiateSync(wasm, go.importObject);
    await go.run(wasmModule.instance);
  } catch (err) {
    console.error(err.message);
  }
})();
