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
2. In the root of the projects will be created default `go_modules` directory
3. In `go_modules` directory will be created `main.go` file.
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

4. Default `main.wasm` file will be compiled (also can be found in `go_modules` directory)
5. You need to put you code into `main.go` file
6. To rewrite `main.wasm` with actual info run:

   ```build.js
   node ./node_modules/nodejs-golang/build.js
   ```

   _Recommendation_: add watcher on `main.go` file to rewrite `main.wasm` on every "save" event

   Also you can run `build` command in code:

   ```build
   const { build } = require('nodejs-golang');
   ...
   await build();
   ```

7. To make result of `main.go` execution available for Node.js - finish you code with `fmt.Print(MY_RESULT)` to write it to stdout
8. To get result of `main.wasm` execution - use `run` function

   ```run
   const { run } = require('nodejs-golang');
   ...
   const MY_RESULT = await run();
   ```

## Multiple Golang scripts

Since nodejs-golang version 0.0.4 there is possibility to create, build and run multiple golang scripts in one project

`GO_MODULE_NAME` is the Node.js environment variable for initialization and building needed script in `go_modules` directory

1. Module initialization:

   ```multiple-init.js
   GO_MODULE_NAME=my_go_module node ./node_modules/nodejs-golang/init.js
   ```

   Also you can run `init` command in code:

   ```multiple-init
   const { init } = require('nodejs-golang');
   ...
   await init('my_go_module');
   ```

2. Directory `go_modules/my_go_module` will be created
3. In `go_modules/my_go_module` directory will be created `main.go` file.
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

4. Default `main.wasm` file will be compiled (also can be found in `go_modules/my_go_module` directory)
5. You need to put you code into `main.go` file
6. To rewrite `main.wasm` with actual info run:

   ```multiple-build.js
   GO_MODULE_NAME=my_go_module node ./node_modules/nodejs-golang/build.js
   ```

   _Recommendation_: add watcher on `main.go` files to rewrite `main.wasm` on every "save" event

   Also you can run `build` command in code:

   ```multiple-build
   const { build } = require('nodejs-golang');
   ...
   await build('my_go_module');
   ```

7. To make result of `main.go` execution available for Node.js - finish you code with `fmt.Print(MY_RESULT)` to write it to stdout
8. To get result of `main.wasm` execution - use `run` function

   ```run
   const { run } = require('nodejs-golang');
   ...
   const MY_RESULT = await run('my_go_module');
   ```

## Use Golang functions in Node.js

Since nodejs-golang version 0.0.5 there is possibility to use Golang functions in Node.js

_Recommendation_: because go functions will be set as global better to use specific naming.
Example: `go_MY_FUNCTION_NAME`

1. In `main.go` file create a function like this (there are some requirements):

   ```funcion
   package main

   import (
       "syscall/js"
   )

   func myFunction(...) interface{} {
       ...
       return js.ValueOf(MY_VALUE)
   }

   func main() {
       c := make(chan struct{}, 0)
       js.Global().Set("go_MY_FUNCTION_NAME", js.FuncOf(myFunction))
       <-c
   }
   ```

   _Requirements_:

   a) there must be an import of "syscall/js"

   b) "myFunction" must be set to "global" js object with some name (better to keep some naming convention).
   For example: `go_MY_FUNCTION_NAME`

   c) use `make` function to initialize channel

2. "instantiate" method should be run with the name of your module as a parameter while application start (or just before you need to use Golang function)

   ```instantiate
   const { instantiate } = require('nodejs-golang');
   ...
   await instantiate('my_go_module');
   ```

3. You can use methods from Golang anywhere in your application

   ```instantiate
   const MY_VALUE = go_MY_FUNCTION_NAME();
   ```

## Support

Linux only, Node.js 14+, Go 1.16.2
