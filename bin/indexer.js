#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');

function walker (cb, root) {
  return async function rec (dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      if ((await fs.stat(res)).isDirectory()) {
        rec(res);
      } else {
        cb(path.relative(root, res));
      }
    }));
  };
}

async function main () {
  const root = path.resolve(process.cwd(), 'specs');
  if (await fs.pathExists(root)) {
    walker(file => { console.log(file); }, root)(root);
  };
};

main();
