#!/usr/bin/env node
'use strict';

const path = require('path');
const { parseArgs } = require('node:util');
const dl = require('../lib/amba-pdf-dl.js');

const USAGE = `
Usage: duh-bus [options]

Options:
  --help                        show help
      --amba-pdf-dl <folder>     download AMBA spec PDFs
`;

const main = async () => {
  const { values } = parseArgs({
    options: {
      help: { type: 'boolean' },
      'amba-pdf-dl': { type: 'string' },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }
  if (values['amba-pdf-dl']) {
    await dl(values['amba-pdf-dl']);
    return;
  }
  const specPath = path.resolve(__dirname, '../specs');
  console.log(specPath);
};

main();

/* eslint no-console:0 */
