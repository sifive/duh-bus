#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs-extra');
const json5 = require('json5');

function walker (cb, root) {
  return function rec (dir) {
    fs.readdir(dir).then(subdirs => {
      Promise.all(subdirs.map(subdir => {
        const res = path.resolve(dir, subdir);
        fs.stat(res).then(e => {
          if (e.isDirectory()) {
            rec(res);
          } else {
            cb(path.relative(root, res), res);
          }
        });
      }));
    });
  };
}

function exporter (path) {
  const arr = path.split(/[/|\\]/);
  arr[arr.length - 1] = arr[arr.length - 1].split(/[.|_]/)[0];
  const res = '\nxassign([' + arr.map(e => `'${e}'`).join(', ') + '])(\n';
  return res;
}

function main () {
  fs.writeFile('./index.js', `'use strict';

const xassign = path => obj =>
  Object.assign(path.reduce((res, cur) =>
    res[cur] || (res[cur] = {}), exports), obj);
`, 'utf8');

  const root = path.resolve(process.cwd(), 'specs');
  fs.pathExists(root).then(exists => {
    if (exists) {
      walker((short, full) => {
        fs.readFile(full, 'utf8').then(body => {
          json5.parse(body);
          fs.appendFile('./index.js', exporter(short) + body + ');\n');
        });
      }, root)(root);
    }
  });
}

main();
