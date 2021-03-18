# Clip.so extension

Clip.so extension handles the communication between the [clip.so](https://clip.so) site and the browser's bookmarks bar.

## System requirements

To be able to run the extension you need

- Node.js version 14.x or higher
- Yarn version 1.x

## Setting up

1. `yarn install` installs the required dependencies.
2. `yarn watch` starts the dev webpack process, that will watch the TypeScript source code and recompile it on each new update to the code.
3. `yarn extension` start development of the extension locally. This uses [web-ext](https://github.com/mozilla/web-ext) to start both an instance of both firefox and chrome, and install the extension in development mode on them. `web-ext` watches the output folder of the webpack process and automatically reloads everytime there is an update to the compiled output.

## Production build

To build a production version of the source code, run `yarn build`. This will output the code into `./dist/js`

## Tests

To run unit tests locally run `yarn test`
