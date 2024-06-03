#!/usr/bin/env node
'use strict';

const process = require('process');
const path = require('path');
const { program } = require('commander');
const dl = require('../lib/amba-pdf-dl.js');

const main = async () => {
  program
    .option('--amba-pdf-dl <folder>', 'download AMBA spec PDFs')
    .parse(process.argv);

  const opts = program.opts();
  if (opts.ambaPdfDl) {
    await dl(opts.ambaPdfDl);
    return;
  }
  const specPath = path.resolve(__dirname, '../specs');
  console.log(specPath);
};

main();

/* eslint no-console:0 */
