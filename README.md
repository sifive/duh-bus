# duh-bus

[![NPM version](https://img.shields.io/npm/v/duh-bus.svg)](https://www.npmjs.org/package/duh-bus)
[![Actions Status](https://github.com/sifive/duh-bus/workflows/Tests/badge.svg)](https://github.com/sifive/duh-bus/actions)

Collection of bus and interface definitions in [DUH](https://github.com/sifive/duh-schema) format (JSON5 documents validated against `duh-schema`).

Each entry describes an interface port-by-port: signals, directions, widths, clocks, resets, and port maps — ready for use by EDA flows and RTL tooling.

## Contents

Specs live in `specs/<vendor>/<library>/<name>/<version>/<name>_rtl.json5` and are exposed through the generated `index.js`.

| Vendor             | Libraries                                                        |
| ------------------ | ---------------------------------------------------------------- |
| `amba.com`         | AMBA3, AMBA4, AMBA5 (AXI, ACE5, AHB, APB, ATB, CHI, LPI, LTI, DTI, CXS, P/Q-Channel, ...) |
| `sifive.com`       | TL (Tile-Link C/UH/UL), VCIX, MEM (RO/WO/SPRAM), PRCI, SCIE, SSCI, TEST (JTAG) |
| `fossi-foundation.org` | Wishbone                                                       |
| `intel.com`        | PIPE (PHY)                                                       |

## Install

```sh
npm i duh-bus
```

Requires Node.js >= 22.

## Use

```js
const duhBus = require('duh-bus');

// Index: vendor -> library -> name -> version -> abstractionDefinition
const axi = duhBus['amba.com']['AMBA4']['AXI4'];
console.log(Object.keys(axi)); // available versions

const ports = axi[Object.keys(axi)[0]].abstractionDefinition.ports;
```

Browse the DUH structure in the [documentation](docs/).

## CLI

```sh
duh-bus --amba-pdf-dl <folder>   # download AMBA specification PDFs into <folder>
duh-bus --help
```

## Adding a Spec

1. Create `specs/<vendor>/<library>/<name>/<version>/<name>_rtl.json5`
2. Regenerate the index: `node bin/indexer.js`

`index.js` is regenerated automatically on publish (`prepublish`).

## Test

```sh
npm test
```

Runs ESLint and Mocha, including DUH schema validation of every published document (via `ajv` + `duh-schema`).

## License

Apache 2.0. See [LICENSE](LICENSE).
