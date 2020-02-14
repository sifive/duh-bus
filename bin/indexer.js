#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs-extra');
const json5 = require('json5');

function walker (cb, root) {
  return function rec (dir) {
    const subdirs = fs.readdirSync(dir);
    Promise.all(subdirs.map(async subdir => {
      const res = path.resolve(dir, subdir);
      const e = fs.statSync(res);
      if (e.isDirectory()) {
        rec(res);
      } else {
        cb(path.relative(root, res), res);
      }
    }));
  };
}

async function main () {
  const index = {};

  const xassign = (pat, name) => {
    console.log(pat);
    const obj = pat.reduce((res, cur) => res[cur] || (res[cur] = {}), index);
    obj.abstractionDefinition = name.abstractionDefinition;
  };

  function exporter (p, body) {
    const arr = p.split(path.sep).slice(0, -1);
    xassign(arr, body);
  }

  fs.writeFileSync('./index.js', `'use strict';\n`, 'utf8');
  const root = path.resolve(process.cwd(), 'specs');
  if (fs.pathExistsSync(root)) {

    walker(async (short, full) => {
      const body = fs.readFileSync(full, 'utf8');
      const obj = json5.parse(body);
      exporter(short, obj);
    }, root)(root);

    Object.keys(index).map(key => {
      fs.appendFileSync('./index.js',
        '\nexports[\'' + key + '\'] = ' + json5.stringify(index[key], null, 2) + ';\n'
      );
    });

  }
}

main();
