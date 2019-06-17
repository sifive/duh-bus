'use strict';

require('json5/lib/register');

module.exports = {
  'amba.com': {
    AMBA3: {
      AHBLite: {r2p0_0: require('./specs/amba.com/AMBA3/AHBLite/r2p0_0/AHBLite_rtl.json5')}
    },
    AMBA4: {
      APB4: {r0p0_0: require('./specs/amba.com/AMBA4/APB4/r0p0_0/APB4_rtl.json5')},
      'AXI4-Lite': {r0p0_0: require('./specs/amba.com/AMBA4/AXI4-Lite/r0p0_0/AXI4-Lite_rtl.json5')},
      AXI4: {r0p0_0: require('./specs/amba.com/AMBA4/AXI4/r0p0_0/AXI4_rtl.json5')},
      AXI4Stream: {r0p0_1: require('./specs/amba.com/AMBA4/AXI4Stream/r0p0_1/AXI4Stream_rtl.json5')}
    }
  },
  'intel.com': {
    PHY: {
      PIPE: {'4.4.0': require('./specs/intel.com/PHY/4.4.0/PIPE_rtl.json5')}
    }
  },
  'sifive.com': {
    MEM: {
      DPRAM: {'0.1.0': require('./specs/sifive.com/MEM/DPRAM/0.1.0/DPRAM_rtl.json5')},
      SPRAM: {'0.1.0': require('./specs/sifive.com/MEM/SPRAM/0.1.0/SPRAM_rtl.json5')}
    }
  }
};

/* eslint camelcase: 0*/
