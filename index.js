const fs = require('fs');
const { exec, spawn } = require('child_process');
const loader = require('@assemblyscript/loader');
const util = require('util');

const { GO_MODULE_NAME, GO_MODULES, NODE_MODULES, NODEJS_GOLANG, MAIN_GO, MAIN_WASM } = require('./constants');

const execPromise = util.promisify(exec);

const cyanColor = '\x1b[36m';
const blueColor = '\x1b[34m';
const yellowColor = '\x1b[33m';
const redColor = '\x1b[31m';
const resetColor = '\x1b[0m';

const init = async (scriptName = '') => {
  try {
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Started init', resetColor);
    const path = __dirname.split(`/${NODE_MODULES}`)[0];

    const scriptPath = `${path}/${GO_MODULES}/${scriptName}`;
    const modulePath = `${path}/${NODE_MODULES}/${NODEJS_GOLANG}`;

    await execPromise(
      `mkdir -p ${scriptPath} && cp -n ${modulePath}/${MAIN_GO} ${scriptPath} && cp -n ${modulePath}/go.mod ${scriptPath} && ${GO_MODULE_NAME}=${scriptName} node ${modulePath}/build.js`,
    );
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished init', resetColor);
  } catch (err) {
    console.log(cyanColor, NODEJS_GOLANG, redColor, 'Error init: ', err.toString(), resetColor);
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished init', resetColor);
  }
};

const build = async (scriptName = '') => {
  try {
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Started build', resetColor);
    const path = __dirname.split(`/${NODE_MODULES}`)[0];

    const scriptPath = `${path}/${GO_MODULES}/${scriptName}`;
    const modulePath = `${path}/${NODE_MODULES}/${NODEJS_GOLANG}`;

    if (!fs.existsSync(`${scriptPath}/${MAIN_GO}`)) {
      throw new Error(`There is no "${MAIN_GO}" file in ${scriptPath} directory`);
    }

    await execPromise(`cd ${scriptPath} && GOOS=js GOARCH=wasm ${modulePath}/go/bin/go build -o ${scriptPath}/${MAIN_WASM}`);
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished build', resetColor);
  } catch (err) {
    console.log(cyanColor, NODEJS_GOLANG, redColor, 'Error build: ', err.toString(), resetColor);
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished build', resetColor);
  }
};

const run = (scriptName = '') => {
  return new Promise((resolve, reject) => {
    console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Started script', resetColor);
    const path = __dirname.split(`/${NODE_MODULES}`)[0];

    const modulePath = `${path}/${NODE_MODULES}/${NODEJS_GOLANG}`;

    const childProcess = spawn('node', [`${modulePath}/instantiate.js`, scriptName]);

    let result = '';
    let error = '';

    childProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    childProcess.stderr.on('data', (err) => {
      error = err.toString();
      console.log(cyanColor, NODEJS_GOLANG, redColor, 'Error script: ', err.toString(), resetColor);
      console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished script', resetColor);
      reject(new Error(error));
    });

    childProcess.stdout.on('close', () => {
      if (!error) {
        console.log(cyanColor, NODEJS_GOLANG, yellowColor, 'Data: ', result, resetColor);
        console.log(cyanColor, NODEJS_GOLANG, blueColor, 'Finished script', resetColor);
        resolve(result);
      }
    });
  });
};

const instantiate = async (scriptName = '') => {
  try {
    require('./go/misc/wasm/wasm_exec');

    const go = new Go();

    const path = `${__dirname.split(`/${NODE_MODULES}`)[0]}/${GO_MODULES}`;

    const wasmPath = scriptName ? `${path}/${scriptName}/${MAIN_WASM}` : `${path}/${MAIN_WASM}`;

    if (!fs.existsSync(wasmPath)) {
      throw new Error(`There is no "${MAIN_WASM}" file in ${wasmPath} directory`);
    }

    const wasm = fs.readFileSync(wasmPath);
    const wasmModule = await loader.instantiateStreaming(wasm, go.importObject);
    go.run(wasmModule.instance);
  } catch (err) {
    console.log(cyanColor, NODEJS_GOLANG, redColor, 'Error instantiate: ', err.message, resetColor);
  }
};

module.exports = {
  init,
  build,
  run,
  instantiate,
};
