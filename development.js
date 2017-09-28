const Application = require('thinkjs');
const babel = require('think-babel');
const watcher = require('think-watcher');
const notifier = require('node-notifier');
const child_process = require('child_process');

child_process.spawn('node', ['./scripts/monitor.js']);

const instance = new Application({
  ROOT_PATH: __dirname,
  watcher: watcher,
  transpiler: [babel, {
    presets: ['think-node']
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'development'
});

instance.run();
