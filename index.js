const fs = require('fs');
const { exec, spawn } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const cyanColor = '\x1b[36m';
const blueColor = '\x1b[34m';
const yellowColor = '\x1b[33m';
const redColor = '\x1b[31m';
const resetColor = '\x1b[0m';

const build = async () => {
  try {
    console.log(cyanColor, 'nodejs-golang', blueColor, 'Started build', resetColor);
    const path = __dirname.split('/node_modules')[0];

    if (!fs.existsSync(`${path}/main.go`)) {
      throw new Error('There is no "main.go" file in the root the project');
    }

    await execPromise(`cd ${path} && GOOS=js GOARCH=wasm ${path}/node_modules/nodejs-golang/go/bin/go build -o ${path}/main.wasm`);
    console.log(cyanColor, 'nodejs-golang', blueColor, 'Finished build', resetColor);
  } catch (err) {
    console.log(cyanColor, 'nodejs-golang', redColor, 'Error build: ', err.toString(), resetColor);
    console.log(cyanColor, 'nodejs-golang', blueColor, 'Finished build', resetColor);
  }
};

const run = () => {
  return new Promise((resolve, reject) => {
    console.log(cyanColor, 'nodejs-golang', blueColor, 'Started script', resetColor);
    const path = __dirname.split('node_modules')[0];

    const childProcess = spawn('node', [`${path}/node_modules/nodejs-golang/main.js`]);

    let result = '';
    let error = '';

    childProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    childProcess.stderr.on('data', (err) => {
      error = err.toString();
      console.log(cyanColor, 'nodejs-golang', redColor, 'Error script: ', err.toString(), resetColor);
      console.log(cyanColor, 'nodejs-golang', blueColor, 'Finished script', resetColor);
      reject();
    });

    childProcess.stdout.on('close', () => {
      if (!error) {
        console.log(cyanColor, 'nodejs-golang', yellowColor, 'Data: ', result, resetColor);
        console.log(cyanColor, 'nodejs-golang', blueColor, 'Finished script', resetColor);
        resolve(result);
      }
    });
  });
};

module.exports = {
  build,
  run,
};
