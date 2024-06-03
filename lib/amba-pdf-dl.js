'use strict';

const { createWriteStream, existsSync } = require('fs');
const { mkdir } = require("fs/promises");
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const specs = require('./amba-specs.js');

const dl = async (ambaSpecsDl) => {
  const dlFolderPath = path.resolve('.', ambaSpecsDl);
  if (!existsSync(dlFolderPath)) {
    await mkdir(dlFolderPath);
  }
  for (const spec of specs) {
    const url = `https://documentation-service.arm.com/static/${spec.id}?token=`;
    const res = await fetch(url);
    const headers = res.headers.entries();
    let fileName;
    for (const [key, val] of headers) {
      if (key === 'content-disposition') {
        const m = val.match(/^attachment; filename=(?<baseName>[\w_-]+).pdf$/);
        fileName = m.groups.baseName + '.pdf';
      }
    }
    const fullFileName = path.resolve('.', dlFolderPath, fileName);
    if (!existsSync(fullFileName)) {
      const fileStream = createWriteStream(fullFileName, { flags: 'wx'});
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      console.log(fileName + ' - downloded');
    } else {
      console.log(fileName + ' - exists');
    }
  }
};

module.exports = dl;
