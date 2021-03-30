# nodejs-golang

<b>Module for running Golang scripts using wasm in Node.js child processes</b>

<a href="https://nodejs.org">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png"
    alt="Sponsored by Evil Martians" width="300" height="150">
</a>

<a href="https://golang.org">
    <img src="https://golang.org/lib/godoc/images/go-logo-blue.svg"
    alt="Sponsored by Evil Martians" width="300" height="150">
</a>

## How It Works

1. During module installation `npm i nodejs-golang` Go programming language will be downloaded and installed
2. In the root of the projects will be created default `main.go` file.
   Example:

   ```main.go
   package main

   import (
       "fmt"
   )

   func main() {
       fmt.Print("Hello, go 1.16.2")
   }
   ```

3. Default `main.wasm` file will be compiled (can be found in the root of the project)
4. You need to put you code into `main.go` file
5. To rewrite `main.wasm` with actual info run:

   ```build.js
   node ./node_modules/nodejs-golang/build.js
   ```

   _Recommendation_: add watcher on `main.go` file to rewrite `main.wasm` on every "save" event.

   Also you can run `build` command in code:

   ```build
   const { build } = require('nodejs-golang');
   ...
   await build();
   ```

6. To make result of `main.go` execution available for node.js - finish you code with `fmt.Print(YOU_RESULT)` to write it to stdout
7. To get result of `main.wasm` execution - use `run` function

   ```run
   const { run } = require('nodejs-golang');
   ...
   const result = await run();
   ```

## Multiple Golang scripts

Since nodejs-golang version 0.0.4 there is possibility to create, build and run multiple golang scripts in one project.

## Support

Linux only, Node.js 14+, Go 1.16.2
