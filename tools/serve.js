/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import express from "express";
import path from 'path';
import cp from 'child_process';
import Task from '../src/shared/utils/Task';

export default new Task('server', function() {
  return new Promise(function(resolve, reject) {

    // Running server.js in a child process so we can proxy to it with BrowserSync
    const server = cp.fork(path.join(__dirname, '../build/server.js'), {
      env: Object.assign({ NODE_ENV: 'development' }, process.env),
      silent: false,
    });

    // We need to know when the server has completed it's initial setup so we can launch browser sync.
    // We're sending this message manually in ../build/server.js
    server.once('message', message => {
      if (message.match(/^online$/)) {
        resolve(server);
      }
    });

    server.once('error', err => reject(err));

    process.on('exit', () => server.kill('SIGTERM'));
  });
});